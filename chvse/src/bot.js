//gets the bot token
require('dotenv').config();
const { token } = process.env;
//gets the discord js
const { Client, Events, Collection, GatewayIntentBits, Partials, PermissionsBitField, IntentsBitField } = require('discord.js');

//gets the fs module
const fs = require('fs');

//load the client
const client = new Client({ 
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildInvites
    ],
     partials: [Partials.User, Partials.GuildMember]
});



//for commands
client.commands = new Collection();
client.commandArray = [];

//for buttons
client.buttons = new Collection();

//for timer
client.cron = require('node-cron');

//for modals
client.modals = new Collection();

//color scheme
client.color = 0x18e1ee;

//reddit data
client.reddit = {};
client.redditIds = [];
//channel data for reddit reshuffle
client.channelData = {};
//telegram data 
client.telebot = [];
//reddit api loader
client.snoowrap = require('snoowrap');
//api class
var snoowrap = client.snoowrap;
client.redditApi = new snoowrap({
    userAgent: process.env.redditUser,
    clientId: process.env.redditId,
    clientSecret: process.env.redditSecret,
    refreshToken: process.env.redditToken
  });
client.redditApi.config({ continueAfterRatelimitError : true});
client.subredditSources = [];
client.teleSources = [];



//load the functions
const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders){
    const functionFiles = fs.readdirSync('./src/functions/'+folder)
    .filter((file) => file.endsWith('.js'));
    
    for (const file of functionFiles){
        //console.log('./functions/'+folder+'/'+file);
        
        require('./functions/'+folder+'/'+file)(client);
    }

    
}

client.once(Events.ClientReady, c => {
    console.log('Ready! Logged in as '+c.user.tag);
    //start the reddit feed timer
    client.handleFeedTimer(); 
    //prep the revenue server
    //client.handleRevenue();
   // client.handleTelecopy();
    //client.handlePartners();
    //client.ClearFeedCache();
    client.handleStatus();
    //client.handleTwitter();
    //client.handleTelebot();
    //client.SubRedditListener();
    
});

client.on("guildMemberAdd", (member) => {
    client.handleJoins(member);
});


//for the events
client.handleEvents();

//for the components
client.handleComponents();

//for the commands
client.handleCommands();

//reddit data
client.LoadRedditData();
//log the bot
client.login(token);