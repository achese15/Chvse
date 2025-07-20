const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('jokes')
        .setDescription('Just For Fun ;)'),
        async execute(interaction, client){
            /*await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });*/
            
            const data = require('../../data/jokes.json');
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
                    content: "Sorry <@"+current_user+"> No More Jokes For Now!"
                });
            }else{
                
                await interaction.reply({
                    content: "Thinking..."
                });
                wait(4000);

                const fortune = items[Math.floor(Math.random()*items.length)];

                const embed = new EmbedBuilder()
                    .setTitle("Here's A Joke, <@"+current_user+">!")
                    .setDescription(fortune)
                    .setColor(client.color)
                    .setThumbnail(avatar);

                await interaction.editReply({
                    embeds: [embed],
                    content:" "
                });

                    read['last_user'] = current_user;

                    const ref = JSON.stringify(read);

                    fs.writeFile('./src/data/jokes.json', ref, (err) => {
                        if(err){
                            console.log(err);
                        }
                    });
            }


            
        }
}