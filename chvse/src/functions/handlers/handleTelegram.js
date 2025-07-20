const fetch = require('node-fetch');

module.exports = (client) => {
    client.handleTelegram = async () => {
        const telegram = process.env.telegram;
        const limit = process.env.limit;
        
      
        

        if(client.telebot.length >= 1){
            
        let data_posts = client.telebot.sort(() => Math.random() - 0.5);

                for (let i = 0; i < limit; i++) { 
                    let telMsg = data_posts[i];
                    let type = "sendPhoto";
                    if(telMsg.is_video){
                        type = "sendAnimation";
                    }
                    
                    let data = {
                        chat_id: "-1001945377788",
                        caption: "<a href=\""+telMsg.link+"\">"+telMsg.subreddit.toUpperCase()+"</a>\n <b>"+telMsg.title+"</b>",
                        animation: telMsg.telbot,
                        photo: telMsg.telbot,
                        has_spoiler: false,
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: telMsg.label,
                                        url: "https://rb.gy/hmu"
                                    }
                                ]
                            ]
                        },
                        text: telMsg.title
                    };

                    const response = await fetch("https://api.telegram.org/bot"+telegram+"/"+type,
                                        {
                                            method: "POST",
                                            body: JSON.stringify(data),
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        }
                                    ); 

                } 
        
        
            }

        client.telebot = [];


    } 
}