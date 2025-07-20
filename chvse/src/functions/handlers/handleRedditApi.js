const fetch = require('node-fetch');
const fs = require('fs');

async function getSubs(source, api, client, index){
                let posts = await api.getSubreddit(encodeURIComponent(source));
                posts = await posts.getNew({time: 'week', limit: 3});

                let store = [];

                posts.forEach((post) => {
                    client.subredditSources.push({
                      link: post.url,
                      text: post.title,
                      video: post.is_video,
                      subreddit: source
                    });
                    
                  });
                 // console.log(index.count+'d'+index.size);
                  if(index.size === index.count){
                    //console.log(posts);
                    sendSubs(source, api, client, index.jobs);
                 }
            }

async function sendSubs(source, api, client, job){
    let store = client.subredditSources.sort(() => Math.random() - 0.5);
    client.subredditSources = [];
    const limit = process.env.limit;
    //console.log(store);
    store.forEach((sub)=> {
        // Submitting a link to a subreddit
        api.getSubreddit(job["subreddit"]).submitLink({
            title: sub.text,
            url: sub.link
        })
        .distinguish()
        .ignoreReports()
        .assignFlair({text: sub.subreddit, css_class: 'modpost'})
        .reply(job["reply"])
        .then((result) => {}).catch((error) => {});
    });
}


module.exports = (client) => {
    client.handleRedditApi = async () => {
        var snoowrap = require('snoowrap');

        var api = client.redditApi;

        const stuff = require('../../data/settings.json');
        const jobs = client.handleLoadRedditClients();
        let subreddits = Object.keys(jobs);

        subreddits.forEach((data)=>{
            let subreddit = jobs[data]["subreddit"];
            let sources = jobs[data]["sources"];
            let reply = jobs[data]["reply"];

            
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