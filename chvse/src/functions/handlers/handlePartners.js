const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
module.exports = (client) => {
    client.handlePartners = async () => {

        //load current server lists
        const serv = require('../../data/servers.json');
        let servers = serv;
        let last_server = servers["last_server"]; 

        let guilds = Object.keys(servers["guilds"]);
       // guilds = guilds.filter(sub =>  sub !== last_server);
        
        if(guilds.length >= 2){
            const lucky = guilds[Math.floor(Math.random()*guilds.length)];
            let ad = servers["guilds"][lucky];


            //filter out the current server
            guilds = guilds.filter(sub =>  sub !== servers["guilds"][lucky]["guild"]);
            //reset last server and increment bump
            const bump = servers["guilds"][lucky]["bumps"] + 1;
            servers["last_server"] = servers["guilds"][lucky]["guild"];
            servers["guilds"][lucky]["bumps"] = bump;
            let current_guild = servers["guilds"][lucky]["guild"];

             //gets the channel and looks for the ad
             const channel = client.channels.cache.get(ad["adchannel"]);
             const current_server = client.guilds.cache.get(ad["guild"]);
             const current_serverlog = client.channels.cache.get(ad["logchannel"]);

             if(channel && current_server && current_serverlog){
                channel.messages.fetch(ad["serverad"])
                .then((message)=>{
                    let serverAd = message.content.replaceAll(/@everyone/gi,"").replaceAll(/@here/gi,"");

                    const post_in = guilds[Math.floor(Math.random()*guilds.length)];
                    let post_server = servers["guilds"][post_in];


                    const adchannel = client.channels.cache.get(post_server["otherads"]);
                    const guildCheck = client.guilds.cache.get(post_server["guild"]);

                    if(adchannel && guildCheck){

                        adchannel.send({
                            content: serverAd
                        });

                        const embed = new EmbedBuilder()
                            .setTitle('New Partnership!')
                            .setDescription("Posted Your Server AD On Our Network")
                            .setColor(client.color);
            

                        current_serverlog.send({
                            embeds: [embed]
                        });


                    }else{
                        delete servers["guilds"][post_in]; 
                    }

                    }).catch((error) =>{
                    console.error(error);
                    });
            }else {
                delete servers["guilds"][current_guild];
            }
            /*
            const ch = JSON.stringify(servers);
                fs.writeFile('./src/data/servers.json', ch, (err) => {
                    if(err){
                        console.log(err);
                    }
                });*/
            //console.log(JSON.stringify(servers["guilds"][lucky]));
        }
        

        
        
    } 
}