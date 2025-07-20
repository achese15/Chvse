const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes A Listener From This Channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) => 
        option
        .setName("password")
        .setDescription('Administrator Password For This Server')
        .setRequired(true)
        ).addStringOption((option) => 
        option
        .setName("subreddit")
        .setDescription('Choose The Subreddit To Be Removed.')
        .setAutocomplete(true)
        .setRequired(true)
        ),
        async autocomplete(interaction, client){
            const channel = interaction.channel.id;
            const subRedditL = require('../../data/subredditchannels.json');
            let subRedditList = subRedditL;
            let complete = [];
            if(subRedditList.hasOwnProperty(channel)){
                complete = subRedditList[channel]["listeners"];
             }

             const focusedValue = interaction.options.getFocused();
             const filtered = complete.filter(choice => choice.startsWith(focusedValue));
             await interaction.respond(
                filtered.map((choice) => ({name: choice, value: choice}))
             );
        },
        async execute(interaction, client){
            await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });

            
            const pass = process.env.iftt;
            const option = interaction.options.getString('password');
            const subreddit = interaction.options.getString('subreddit').trim();
            const channel = interaction.channel.id;
            
            if(option === pass){
                const subRedditL = require('../../data/subredditchannels.json');
                const subRedditSRC = require('../../data/subreddit.json');
                let subRedditData = subRedditSRC;
                let subRedditList = subRedditL;
                if(subRedditList.hasOwnProperty(channel)){
                    const refined = subRedditList[channel]["listeners"]
                    .filter(sub =>  sub !== subreddit);
                    
                    subRedditList[channel]["listeners"]= refined;


                    
                    const ch = JSON.stringify(subRedditList);
        
                    fs.writeFile('./src/data/subredditchannels.json', ch, (err) => {
                        if(err){
                            console.log(err);
                        }
                    });

                    if(subRedditData.hasOwnProperty(subreddit)){
                        const refinedData = subRedditData[subreddit]['channels']
                        .filter(sub =>  sub !== channel);
                        
                        subRedditData[subreddit]['channels'] = refinedData;
                        const ref = JSON.stringify(subRedditData);

                        fs.writeFile('./src/data/subreddit.json', ref, (err) => {
                            if(err){
                                console.log(err);
                            }
                        });
                    }

                    await interaction.editReply({
                        ephemeral: true,
                        content: "The Subreddit Listener For: "+subreddit+" has been removed from This Channel <#"+channel+">"
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
                    content: "Wrong Password"
                });
            }

            
            
        }
}