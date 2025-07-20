const fetch = require('node-fetch');
const fs = require('fs');
const cron = require('node-cron');
const snoowrap = require('snoowrap');

async function subredditExists(subredditName,process) {
    
        const reddit = new snoowrap({
            userAgent: process.env.redditUser,
            clientId: process.env.redditId,
            clientSecret: process.env.redditSecret,
            refreshToken: process.env.redditToken
        });

  try {
    const subreddit = await reddit.getSubreddit(subredditName).fetch();
    if (subreddit && subreddit.display_name) {
      //console.log(`✅ Subreddit "${subreddit.display_name}" exists.`);
      return true;
    }
  } catch (err) {
    if (err.statusCode === 404) {
      //console.log(`❌ Subreddit "${subredditName}" does not exist.`);
    } else {
      //console.error(`⚠️ Error checking subreddit:`, err.message);
    }
  }
  return false;
}

function isUrlValid(str) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return pattern.test(str);
   }

module.exports = {
    data: {
        name: 'subreddit'
    },
    async execute(interaction, client){
        const subreddit = interaction.fields.getTextInputValue('subreddit').trim();
        const link = interaction.fields.getTextInputValue('link').trim();
        const guild = interaction.guild.id;
        const button = interaction.fields.getTextInputValue('button').trim();
        const channel = interaction.channel.id;
       
        await interaction.deferReply({
            fetchReply: true,
            ephemeral: true,
        });

        //const settings = require('../../data/settings.json');
        const sets = client.handleLoadAffiliates();
        const checkV = await subredditExists(subreddit,process);
        if(checkV){
                if(isUrlValid(link) || sets.hasOwnProperty(link)){
            
                const subRedditSRC = require('../../data/subreddit.json');
                const subRedditL = require('../../data/subredditchannels.json');
                let subRedditData = subRedditSRC;
                let subRedditList = subRedditL;
                if(!subRedditData.hasOwnProperty(subreddit)){
                    subRedditData[subreddit] = {
                        "ids":[],
                        "subreddit":subreddit,
                        "link": link,
                        "button": button,
                        "channels":[]
                    };    
                }

                if(!subRedditData[subreddit]['channels'].includes(channel)){
                    subRedditData[subreddit]['channels'].push(channel);
                } 
                
                if(!subRedditList.hasOwnProperty(channel)){
                    subRedditList[channel] = {
                        "guild":guild,
                        "listeners": []
                    };
                    subRedditList[channel]["listeners"].push(subreddit);
                }else if(!subRedditList[channel]["listeners"].includes(subreddit)){
                    subRedditList[channel]["listeners"].push(subreddit);
                }

                subRedditData[subreddit]['button'] = button;
                subRedditData[subreddit]['link'] = link;

                const ref = JSON.stringify(subRedditData);
                const ch = JSON.stringify(subRedditList);

                fs.writeFile('./src/data/subreddit.json', ref, (err) => {
                    if(err){
                        console.log(err);
                    }
                });

                fs.writeFile('./src/data/subredditchannels.json', ch, (err) => {
                    if(err){
                        console.log(err);
                    }
                });

                
                await interaction.editReply({
                    ephemeral: true,
                    content: "The Subreddit Listener For: "+subreddit+" has been added To This Channel <#"+channel+">"
                });
                //refresh posts with new reddit feeds
                client.SubRedditListener();
            }else{
                await interaction.editReply({
                    ephemeral: true,
                    content: "The Link Is Invalid!"
                });
            }

         }else{
            await interaction.editReply({
                    ephemeral: true,
                    content: `❌ Subreddit "${subreddit}" does not exist.`
                });
         }

    }
};