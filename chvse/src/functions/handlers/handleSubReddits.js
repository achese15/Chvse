const fetch = require('node-fetch');
const fs = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const snoowrap = require('snoowrap');
function delayExecution() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 5000); // 5000 milliseconds = 5 seconds
  });
}



async function send_reddit_posts(client){
    let data_posts = client.channelData;
   // console.log(client.channelData)
    let data_keys = Object.keys(data_posts);
    //console.log(Object.keys(client.channelData));
    data_keys.forEach((data_id)=>{
        const channel = client.channels.cache.get(data_id);
        let posts = data_posts[data_id]["posts"].sort(() => Math.random() - 0.5);

        posts.forEach((post)=>{
            channel.send({
                content: post.content,
                components: post.components
            });
        });
        delete data_posts[data_id];
    });
    
    //client.handleTelegram();
}
async function subredditExists(reddit,subredditName) {
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
// Fetch posts from a subreddit
async function fetchSubredditPosts(r,subredditName, limit) {

    try {
      const subreddit = await r.getSubreddit(subredditName);
      const posts = await subreddit.getNew({ limit: limit });
      return posts;
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
      return [];
    }

  }
async function startLoad(r,sub,client,newFocus,focus){
        fetchSubredditPosts(r,sub, 7)
                .then(posts => { 
                    
        const formatter = " ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| ";
        
                    //now to post to the channels
                    const channelList = newFocus['channels'];
                    //creates the link button
                    const button = new ButtonBuilder()
                                    .setLabel(client.handleLabel(focus['button']))
                                    .setURL(client.handleLinks(focus['link']))
                                    .setStyle(ButtonStyle.Link);
                    const ButtonLink = new ActionRowBuilder().addComponents(button);
                    
                    const buttonR = new ButtonBuilder()
                                    .setLabel(focus['subreddit'])
                                    .setCustomId('button')
                                    .setStyle(ButtonStyle.Primary);
                    const ButtonReddit = new ActionRowBuilder().addComponents(buttonR);

                    for(let i = 0;i<posts.length;i++){
                        let post = posts[i];
                            
                            if(client.redditIds.includes(post.id) === false && post.is_self === false && post.hasOwnProperty("crosspost_parent_list") === false){
                                
                                client.redditIds.push(post.id)
                                
                                        channelList.forEach((channelId) => {
                                            const channel = client.channels.cache.get(channelId);
                                        // console.log(list[channelId]["guild"]);
                                            //const guildCheck = client.guilds.cache.get(list[channelId]["guild"]);
                                            let reddit_content = post.url;
                                            let links = client.handleLinks(focus['link']);
                                            let labels = client.handleLabel(focus['button']);


                                            if(channel){
                                                
                                                if(!client.channelData.hasOwnProperty(channelId)){
                                                    client.channelData[channelId] = {
                                                        "id":channelId,
                                                        "posts": []
                                                    };
                                                }

                                                client.channelData[channelId]["posts"].push({
                                                        content: formatter+reddit_content,
                                                        telbot: reddit_content,
                                                        label: labels,
                                                        link: links,
                                                        title: post.title,
                                                        subreddit: post.subreddit,
                                                        is_video: post.is_video,
                                                        components: [ButtonLink]
                                                });
                                                
                                                client.telebot.push({
                                                        telbot: reddit_content,
                                                        label: labels,
                                                        link: links,
                                                        title: post.title,
                                                        subreddit: post.subreddit,
                                                        is_video: post.is_video
                                                });
                                                //console.log("pushing");
                                        /* channel.send({
                                                        content: formatter+reddit_content,
                                                        components: [ButtonLink]
                                                    });*/
                                                }

                                        });
                            }
                        }
                    
                });
        
}
async function getNewPosts(r,focus, client, size, count, list){
    
    //get channels so we can cross reference to see if we are still in those servers to avoid errors with sending messages

    //console.log(feed);
    const newFocus = focus;
    const postTrim = [];
    const limit = process.env.limit;
    const sort = process.env.sort;
    // Create a snoowrap object with your Reddit app credentials
    let redditState = false;
    const exists = await subredditExists(r, focus['subreddit']);
     if (exists) {
        await startLoad(r,focus['subreddit'],client,newFocus,focus);
       } 
            
             client.reddit[focus['subreddit']] = newFocus;
         
            
}


module.exports = (client) => {
    client.SubRedditListener = async () => {

        await client.LoadRedditData();
    const subRedditSRC = require('../../data/subreddit.json');
    const subRedditData = subRedditSRC;
    const subRedditL = require('../../data/subredditchannels.json');
    let subRedditList = subRedditL;
    let subreddits = Object.keys(subRedditData);
    const size = subreddits.length;
    let count = 0;

    const r = new snoowrap({
        userAgent: process.env.redditUser,
        clientId: process.env.redditId,
        clientSecret: process.env.redditSecret,
        refreshToken: process.env.redditToken
    });

    for(let i = 0;i<subreddits.length;i++){
        delayExecution();
        let subData = subreddits[i];
        const focus = subRedditData[subData];
            const focusIds = focus['ids'];
            const focusFeed = focus['subreddit'];
            const focusChannels = focus['channels'];

            count = count + 1;
            if(focus['channels'].length >= 1){
                //console.log(focusFeed);
                const newData = await getNewPosts(r,focus, client, size, count, subRedditList);
            }

            //console.log(newData['data']);
            
            if((i+1) == subreddits.length){
            await send_reddit_posts(client)
            client.SaveRedditData(client.redditIds);
            client.redditIds = [];
            }
           // subRedditData[subData]['ids'] = newData['ids'];
    }
        
       

        
    }
}