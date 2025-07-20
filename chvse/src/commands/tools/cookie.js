const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('fortune')
        .setDescription('Fortune Cookie!'),
        async execute(interaction, client){
            /*await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });*/
            
            const data = require('../../data/cookie.json');
            const read = data;
            const last_user = read['last_user'];
            const items = read['data'];

            const current_user = interaction.user.id;
            const channel  = interaction.channel.id;
            const avatar = interaction.user.displayAvatarURL();
            const bot = client.user.displayAvatarURL();
            
            if(last_user === current_user){
                await interaction.reply({
                    ephemeral: true,
                    content: "Sorry <@"+current_user+"> You Have To Wait A Little To Get Another Fortune."
                });
            }else{
                
                await interaction.reply({
                    content: "Asking The Universe..."
                });
                wait(2000);

                const fortune = items[Math.floor(Math.random()*items.length)];

                const embed = new EmbedBuilder()
                    .setTitle("<@"+current_user+">'s Fortune!")
                    .setDescription(fortune)
                    .setColor(client.color)
                    .setFooter({
                        iconURL: bot,
                        text: "From The Universe ;)"
                    })
                    .setThumbnail(avatar);

                await interaction.editReply({
                    embeds: [embed],
                    content:" "
                });

                    read['last_user'] = current_user;

                    const ref = JSON.stringify(read);

                    fs.writeFile('./src/data/cookie.json', ref, (err) => {
                        if(err){
                            console.log(err);
                        }
                    });
            }


            
        }
}