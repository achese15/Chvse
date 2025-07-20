const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');



module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop Partnerships, This Will Remove Your Server From Our Network!')
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
                delete servers["guilds"][guild];
                const ch = JSON.stringify(servers);
                fs.writeFile('./src/data/servers.json', ch, (err) => {
                    if(err){
                        //console.log(err);
                        reply["content"] = "Cannot Remove Your Server At This Time, Please Try Again Later.";
                        interaction.editReply(reply);
                    }else{
                        reply["content"] = "Successfully Removed Your Server!";
                        interaction.editReply(reply);
                    }
                });
             }else{
                reply["content"] = "This Server Is Not On Our Network!";
                interaction.editReply(reply);
             }
           
           
           
        }
}