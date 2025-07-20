const { ActivityType } = require('discord.js');
const fetch = require('node-fetch');

module.exports = (client) => {
    client.handleStatus = async () => {
       
        const status = [
            {
                type: ActivityType.Listening,
                text: "To Chuck Norris",
                status: "online",
            },
            {
                type: ActivityType.Playing,
                text: "Partner Manager",
                status: "dnd",
            },
            {
                type: ActivityType.Playing,
                text: " Joker",
                status: "online",
            },
            {
                type: ActivityType.Playing,
                text: "Fortune Cookie",
                status: "idle",
            },
            {
                type: ActivityType.Listening,
                text: "To The Universe....",
                status: "dnd",
            },
            {
                type: ActivityType.Listening,
                text: "To Reddit",
                status: "dnd",
            },
            {
                type: ActivityType.Listening,
                text: "To Funny Jokes",
                status: "online",
            },
            {
                type: ActivityType.Listening,
                text: "To Random Facts",
                status: "idle",
            }

        ];

        const option = Math.floor(Math.random() * status.length);

        await client.user.setPresence({
            activities:[
                            {
                                name: status[option].text,
                                type: status[option].type
                            }   
                        ],
            status: status[option].status
        });

    } 
}