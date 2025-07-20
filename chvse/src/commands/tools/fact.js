const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('facts')
        .setDescription('Hear A Random Fact!!'),
        async execute(interaction, client){
            /*await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });*/
            
            const data = require('../../data/facts.json');
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
                    content: "Sorry <@"+current_user+"> You Have To Wait A Little To Get More Facts!"
                });
            }else{
                
                await interaction.reply({
                    content: "Looking For Interesting Facts..."
                });
                wait(4000);

                const fortune = items[Math.floor(Math.random()*items.length)];

                const embed = new EmbedBuilder()
                    .setTitle("Here's A Fact For <@"+current_user+">!")
                    .setDescription(fortune)
                    .setColor(client.color)
                    .setThumbnail(avatar);

                await interaction.editReply({
                    embeds: [embed],
                    content:" "
                });

                    read['last_user'] = current_user;

                    const ref = JSON.stringify(read);

                    fs.writeFile('./src/data/facts.json', ref, (err) => {
                        if(err){
                            console.log(err);
                        }
                    });
            }


            
        }
}