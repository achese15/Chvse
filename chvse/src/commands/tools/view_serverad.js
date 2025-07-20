const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('view')
        .setDescription('View This Server\'s Partnership Details On Our Network')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(interaction, client){
           await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });
             
            //what the reply will contain
             let reply = {
                ephemeral: true,
                content: "Something Is Wrong!" 
            };


            //load current server lists
            const serv = require('../../data/servers.json');
            let servers = serv;
            const guild = interaction.guild.id;
            
            if(servers["guilds"].hasOwnProperty(guild)){
                let current_server = servers["guilds"][guild];
                const current_user = interaction.user.id;
                 //gets the channel and looks for the ad
                const channel = client.channels.cache.get(current_server["adchannel"]);
               
                const current_serverad = current_server["adchannel"];
                const current_serverlog = current_server["logchannel"];
                const current_serverads = current_server["otherads"];
                const bumps = current_server["bumps"];
                let serverAd = "The Partnership AD for this server is missing!";

                if(channel){
                    //console.log("here");
                        channel.messages.fetch(current_server["serverad"])
                        .then((message)=>{
                            const txt = message.content;
                            //console.log(txt);

                            const embed = new EmbedBuilder()
                                .setTitle('Partnership Details')
                                .setColor(client.color)
                                .addFields([
                                    {
                                        name: 'AD Channel',
                                        value: "<#"+current_serverad+">"
                                    },
                                    {
                                        name: 'Partnership Channel',
                                        value: "<#"+current_serverads+">"
                                    },
                                    {
                                        name: 'Log Channel',
                                        value: "<#"+current_serverlog+">"
                                    },
                                    {
                                        name: 'Bumps',
                                        value: bumps+""
                                    }
                                ]);

                                reply["content"] = "```"+txt+"```";
                                reply["embeds"] = [embed];

                                //console.log(reply["content"]);
                                
                                interaction.editReply(reply);

                            }).catch((error)=> {
                                reply["content"] = "Server AD Has Been Deleted!";
                                

                    
                                interaction.editReply(reply);

                            });
                    }else{
                        const embed = new EmbedBuilder()
                    .setTitle('Partnership Details')
                    .setColor(client.color)
                    .addFields([
                        {
                            name: 'AD Channel',
                            value: "<#"+current_serverad+">"
                        },
                        {
                            name: 'Partnership Channel',
                            value: "<#"+current_serverads+">"
                        },
                        {
                            name: 'Log Channel',
                            value: "<#"+current_serverlog+">"
                        }
                    ]);
                    
                
                    reply["content"] = "Server AD Has Been Deleted!";
                    reply["embeds"] = [embed];

                    
                    interaction.editReply(reply);

                }



                
                    

             }else{
                reply["content"] = "This Server Is Not On Our Network!";
                interaction.editReply(reply);
             }
           
           
           
        }
}