const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const fs = require('node:fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('listeners')
        .setDescription('Shows A List Of Reddit Feeds For This Channel')
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

            const pass = process.env.iftt;
            const option = interaction.options.getString('password');
            const channel = interaction.channel.id;
            
            if(option === pass){
                const subRedditL = require('../../data/subredditchannels.json');
                const subRedditList = subRedditL;
                

                if(subRedditList.hasOwnProperty(channel)){
                    let text = "";   
                    const count = subRedditList[channel]["listeners"].length+"";
                    subRedditList[channel]["listeners"].forEach((subreddit) => {
                        text = text+"\n**/r/"+subreddit+"**";
                    });


                    if(count >= 1){
                            const embed = new EmbedBuilder()
                            .setTitle("Subreddit Listeners For: <#"+channel+">")
                            .setDescription(text)
                            .setColor(client.color)
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .addFields([
                                {
                                    name: 'Number Of Listeners',
                                    value: count
                                }
                            ]);
                            
                            
                            await interaction.editReply({
                                embeds: [embed],
                                ephemeral: true
                            });
                    }else{
                        await interaction.editReply({
                            ephemeral: true,
                            content: "This Channel: <#"+channel+"> Has No Subreddit Listeners"
                        });
                    }

                }else{
                    await interaction.editReply({
                        ephemeral: true,
                        content: "This Channel: <#"+channel+"> Has No Subreddit Listeners"
                    });
                }



            }else{
                await interaction.editReply({
                    ephemeral: true,
                    content: "Wrong Password"
                });
            }

        }
}