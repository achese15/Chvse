const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const fs = require('node:fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows Bot Statistics')
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
            
            if(option === pass){
                //update the cache
                //await client.guilds.cache.fetch();

                const subRedditL = require('../../data/subredditchannels.json');
                const serv = require('../../data/servers.json');
                const subRedditSRC = require('../../data/subreddit.json');
    

                
                //no of listeners
                //no of partners
                //no of servers
                //no of automated channels
                let subRedditList = Object.keys(subRedditL);
                let servers = Object.keys(serv["guilds"]);
                let subReddits = Object.keys(subRedditSRC);
                let count = client.guilds.cache.size;
                
                let channels = "0";
                let guilds = "0";
                let reddits = "0";
                let serverCount = JSON.stringify(count);

                //automated channels
                if(subRedditList){
                    channels = JSON.stringify(subRedditList.length);
                }

                //number of partners
                if (servers) {
                    guilds = JSON.stringify(servers.length);
                }

                //no of listeners
                if (subReddits) {
                    reddits = JSON.stringify(subReddits.length);
                }
   

                //console.log(JSON.stringify(serverCount));

                        const embed = new EmbedBuilder()
                            .setTitle('Bot Statistics')
                            .setDescription('embed description')
                            .setColor(client.color)
                            .setAuthor({
                                iconURL: client.user.displayAvatarURL(),
                                name: client.user.tag
                            })
                            .setFooter({
                                iconURL: interaction.user.displayAvatarURL(),
                                text: interaction.user.tag
                            })
                            .setThumbnail(client.user.displayAvatarURL())
                            .addFields([
                                {
                                    name: 'Number Of Servers',
                                    value: serverCount
                                }
                            ]).addFields([
                                {
                                    name: 'Partners',
                                    value: guilds
                                }
                            ]).addFields([
                                {
                                    name: 'Automated Channels',
                                    value: channels
                                }
                            ]).addFields([
                                {
                                    name: 'SubReddits',
                                    value: reddits
                                }
                            ]);
                            
                            interaction.editReply({
                                embeds: [embed],
                                ephemeral: true
                            });




            }else{
                await interaction.editReply({
                    ephemeral: true,
                    content: "Wrong Password"
                });
            }

        }
}