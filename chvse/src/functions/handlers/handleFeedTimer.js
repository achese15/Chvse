const { ActivityType } = require('discord.js');

module.exports = (client) => {
    client.handleFeedTimer = async () => {
        
        const at = client.cron.schedule(process.env.refresh, () => {
          client.handleCrashDump('ClearFeedCache');
            client.ClearFeedCache();
           // console.log('Clearing Cache');
          });
          
          const ay = client.cron.schedule(process.env.status, () => {
            client.handleCrashDump('handleStatus');
            client.handleStatus();
           // console.log('Updating Status');
          });
        const bt = client.cron.schedule(process.env.partner, () => {
          client.handleCrashDump('handlePartners');
          for (let i = 0; i < process.env.loop; i++) { 
          client.handlePartners();
          }  
                       
            // console.log('Growing Servers...');
          });

        const ct = client.cron.schedule(process.env.timer, () => {
          client.handleCrashDump('subredditlistener');
            client.SubRedditListener();
          // console.log('Listening To Various SubReddits');
          });


          const rt = client.cron.schedule(process.env.redditTimer, () => {
            //login to reddit
            client.handleCrashDump('handleRedditApi');
              //client.handleRedditApi();
              //client.handleTelebot();
          });

        ct.start(); at.start(); bt.start(); ay.start(); rt.start();
    } 
}