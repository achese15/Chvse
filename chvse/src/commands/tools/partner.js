const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');



module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('partner')
        .setDescription('Partner With Other Servers On Our Network OR Overwrite Existing Partnership')
        //.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) => 
        option
        .setName("serverad")
        .setDescription('Message ID of server AD')
        .setRequired(true)
        )
        .addChannelOption((option) => 
        option
        .setName("adchannel")
        .setDescription('Channel where your server ad has been posted')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
        )
        .addChannelOption((option) => 
        option
        .setName("otherads")
        .setDescription('Channel where other server ADs will be posted')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
        )
        .addChannelOption((option) => 
        option
        .setName("logchannel")
        .setDescription('Log Channel For Feedback')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
        ),
        async execute(interaction, client){
            await interaction.deferReply({
                ephemeral: true,
                fetchReply: true
            });
            //what the reply will contain
            let reply = {
                ephemeral: true,
                content: "Something Is Wrong!" 
            };

            //load current server lists
            const serv = require('../../data/servers.json');
            let servers = serv;

            const integer = interaction.options.getString('serverad').trim();
            const logchannel = interaction.options.getChannel('logchannel').id;
            const otherads = interaction.options.getChannel('otherads').id;
            const adchannel = interaction.options.getChannel('adchannel').id;
            
            //const int = JSON.stringify(integer);
            const guild = interaction.guild.id;

            //gets the channel and looks for the ad
            const channel = client.channels.cache.get(adchannel);
             channel.messages.fetch(integer)
             .then((message)=>{
                //console.log(message.content);
                
                servers["guilds"][guild] = {
                    "guild": guild,
                    "serverad": integer,
                    "adchannel": adchannel,
                    "logchannel": logchannel,
                    "otherads": otherads,
                    "bumps": 0
                };
                
                const ch = JSON.stringify(servers);
                fs.writeFile('./src/data/servers.json', ch, (err) => {
                    if(err){
                        console.log(err);
                        reply["content"] = "Cannot Add Your Server At This Time";
                        interaction.editReply(reply);
                    }else{
                        reply["content"] = "Your Server Has Been Added To Our Partner Network.";
                        interaction.editReply(reply);
                    }
                });

               
                
             })
             .catch((error) =>{
                reply["content"] = "Server AD Was Not Found In <#"+adchannel+">.\n **Please Ensure You Copied The Right ID For Your Server AD**"; 
                interaction.editReply(reply);
            });
            
            
            //console.log(JSON.stringify(adExists));
            
            

            
            
        }
}