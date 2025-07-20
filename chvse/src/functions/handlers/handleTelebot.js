const fetch = require('node-fetch');
const fs = require('fs');


async function sendTelemsg(telegram,type,data){
  const res =  await fetch("https://api.telegram.org/bot"+telegram+"/"+type,
                                        {
                                            method: "POST",
                                            body: JSON.stringify(data),
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        }
                                    );

        //console.log(res);
}

async function getSubs(source, api, client, index){
                let posts = await api.getSubreddit(encodeURIComponent(source["subreddit"]));
                posts = await posts.getNew({time: 'week', limit: 3});

                let store = [];
                let links = client.handleLinks(source["link"]);
                let labels = client.handleLabel(source["label"]);

                posts.forEach((post) => {
                    let reddit_content = post.url;

                        if(post.is_video){
                            reddit_content = post["media"]["reddit_video"]["fallback_url"];
                                        }

                    client.teleSources.push({
                      link: reddit_content,
                      text: post.title,
                      video: post.is_video,
                      subreddit: source["subreddit"],
                      label: labels,
                      affiliate: links,
                    });
                    
                  });
                 // console.log(index.count+'d'+index.size);
                  if(index.size === index.count){
                    //console.log(client.teleSources);
                    sendSubs(source,client, index.jobs);
                 }
            }

async function sendSubs(source,client,job){
    //console.log(client.teleSources);
    let store = client.teleSources.sort(() => Math.random() - 0.5);
    client.teleSources = [];
    const limit = process.env.limit;
    const telegram = process.env.telegram;


    //console.log(store);
    store.forEach((telMsg)=> {



                    let type = "sendPhoto";
                    if(telMsg.video){
                        type = "sendVideo";
                    }
                    
                    //console.log(job["chat_id"]);
                    let data = {
                        chat_id: job["chat_id"],
                        caption: "<a href=\""+telMsg.affiliate+"\">"+telMsg.subreddit.toUpperCase()+"</a>\n <b>"+telMsg.text+"</b>",
                        video: telMsg.link,
                        photo: telMsg.link,
                        has_spoiler: false,
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: telMsg.label,
                                        url: telMsg.affiliate
                                    }
                                ]
                            ]
                        },
                        text: telMsg.text
                    };
            
                    sendTelemsg(telegram,type,data)
                                    
                                    







       
    });
}



module.exports = (client) => {
    client.handleTelebot = async () => {
        var snoowrap = require('snoowrap');

        var api = client.redditApi;

        const stuff = require('../../data/settings.json');
        const jobs = stuff["telegram_clients"];
        let channels = Object.keys(jobs);

        channels.forEach((data)=>{
            let chat = jobs[data]["chat_id"];
            let sources = jobs[data]["sources"];

            
            const size = sources.length;
            let count = 0;
            
            sources.forEach((source) => {
                count = count + 1;
                let index = {
                    "count": count,
                    "size": sources.length,
                    "jobs": jobs[data]
                };
                 getSubs(source,api,client, index);
                 
            });

           
        });
       

    } 
}