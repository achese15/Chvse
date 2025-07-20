const fetch = require('node-fetch');
const { TelegramClient, Api, MessageMedia} = require("telegram");
const { Button } = require("telegram/tl/custom/button");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const { EditedMessage } = require("telegram/events/EditedMessage");
const input = require("input");
const fs = require('fs');


//declaring important variables
const stuff = require('../../data/settings.json');
const teledata = stuff["telecopy"];
const bot_token = process.env.telegram;
const apiId = teledata["apiId"];
const apiHash = teledata["apiHash"];
//const storeSession = new StoreSession("telegram_session");  see: https://painor.gitbook.io/gramjs/getting-started/authorization#store-session
const stringSession = new StringSession(teledata["stringSession"]); // fill this later with the value from session.save()
const botSession = new StringSession(teledata["botSession"]);
const dataset = teledata["dataset"];
const discordClient = '';

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

function extractAndReplacePatterns(inputString) {
    const regex = /\[button label=(.*?)\](.*?)\[\/button\]/g;
  
    const extractedData = [];
    const replacedString = inputString.replace(regex, (match, label, text) => {
      extractedData.push({ label, text });
      return '';
    });
  
    return { extractedData, replacedString };
  }

async function botSend(channel,text,PATH,markup,extractedData,client){
    const bot = new TelegramClient(botSession, apiId, apiHash, {
            connectionRetries: 5,
        });
        bot.setLogLevel("none");
    await bot.start({
            botAuthToken: bot_token
        });
        const clicks = [];
        
        extractedData.forEach((data)=>{
            clicks.push([Button.url(client.discord.handleLabel(data["label"]),client.discord.handleLinks(data["text"]))]);
        });
        //Button._isInline(false);
       // clicks.push([Button.url(client.discord.handleLabel(markup["label"]),client.discord.handleLinks(markup["link"]))]);
        //linkvertise
        //console.log(client.discord.handleLinks("adult"))
         clicks.push([Button.url(client.discord.handleLabel("passkey_label"),client.discord.handleLinks("passkey"))]);
       
         clicks.push([Button.url(client.discord.handleLabel("access_label"),client.discord.handleLinks("access"))]);
       
        //console.log("Connected As A Bot!!");
        //console.log(bot.session.save());
        //console.log(text);
        const marks = bot.buildReplyMarkup(clicks,true);
        bot.setParseMode("html");
            await bot.sendMessage(channel,{
            message: text,
            file: PATH,
            buttons: marks
            });
        bot.disconnect();
        
        fs.unlink(PATH, (err)=>{
            if(err){
            console.error("Could Not Delete File");
            }
            });
}


function generateRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    return result;
  }



function removeLinksAndReplace(inputString, replacementString) {
    // Regular expression to match URLs
    const urlRegex = /(?:https?|ftp):\/\/[\n\S]+/gi;
  
    // Replace URLs with the preset string
    const resultString = inputString.replace(urlRegex, replacementString);
  
    return resultString;
  }

  function control_handler(check,result,def){
        if(check["clean_links"]){
            return result;
        }else{
            if(check["delete_links"]){
                return removeLinksAndReplace(result, "");
            }else{
                return def;
            }
            
        }
  }





async function sendTelemsg(telegram,data){
    const res =  await fetch("https://api.telegram.org/bot"+telegram+"/sendMessage",
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

async function sendMsg(channel,message,source,client){
    let data = {
        chat_id: channel,
        text: message,
        has_spoiler: false,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: client.discord.handleLabel(source.label),
                        url: client.discord.handleLinks(source.link)
                    }
                ]
            ]
        }
    };
    sendTelemsg(bot_token,data);
}


async function telecopy (client,source,channel){
    const sourceId = source["source_id"];
    const markup = source["reply_markup"]; 
    const controls = source["controls"]

    async function eventPrint(event) {
        await client.connect();
        // see 'node_modules/telegram/tl/custom/message.d.ts'
        const message = event.message;
        const type = event.message.className.toLowerCase();
        const media = event.message.media;

        const { extractedData, replacedString } = extractAndReplacePatterns(message.text);

        const cleaned = removeLinksAndReplace(replacedString, client.discord.handleLinks("<b>"+markup["link"]+"</b>")); 
        let textmark = control_handler(controls,cleaned,replacedString);
        
        //console.log(extractedData);

        
        const text = message.text;
        // console.log(`The text is: ${text}`);
        //console.log(`The channel to send: ${channel}`);

        if(media === null){
            sendMsg(channel,textmark,markup,client);
        }else{
            //console.log(message.media.photo.sizes);
            if(message.media.photo){
                const photo = message.media.photo;
                
                const downloadPath = "file"+generateRandomString(7)+".jpg";

                const buffer = await client.downloadMedia(message,{
                    progressCallback: ()=>{}
                });
                await fs.writeFileSync(downloadPath,buffer);

                await botSend(channel,textmark,downloadPath,markup,extractedData,client);
            }else if(message.document){
                try {
                        
                        const media = message.media;
                        const document = media.document;

                        const fileName = document.CONSTRUCTOR_ID+generateRandomString(7);
                        const mimeType = document.mimeType;
                
                        // Get the file extension from the MIME type
                        const fileExtension = mimeType.split('/')[1];
                        console.log("starting download");
                        // Download the file
                        const buffer = await client.downloadMedia(document, {});
                
                        // Save the file with the appropriate extension and type
                        const PATH = `${fileName}.${fileExtension}`;
                        

                        fs.writeFileSync(PATH, buffer);
                
                        //console.log(`File "${fileName}" downloaded and saved.`);

                        await botSend(channel,textmark,PATH,markup,extractedData,client);
                        
                    
                  } catch (error) {
                    console.error('Error downloading and saving the file:', error);
                  }
            }
        }
        
    }

   
    client.addEventHandler(eventPrint, new NewMessage({ chats: [sourceId] }));
   // client.addEventHandler(eventPrint, new EditedMessage({ chats: [chatId] }));
};




module.exports = (client) => {
    client.handleTelecopy = async () => {
        
        console.log("Loading interactive example...");
     
                const user = new TelegramClient(stringSession, apiId, apiHash, {
                        connectionRetries: 5,
                    });

                    /* 
                    await user.start({
                        botAuthToken: bot_token
                    });
            */
                user.setLogLevel("none");
                await user.start({
                    phoneNumber: async () => await input.text("Please enter your number: "),
                    password: async () => await input.text("Please enter your password: "),
                    phoneCode: async () =>
                        await input.text("Please enter the code you received: "),
                    onError: (err) => console.log(err),
                });
                console.log("Connected As A User!!");
                //client.session.save(); // Save the session to avoid logging in again
            //console.log(client.session.save()); // Save this string to avoid logging in again

                    


                    const jobs = client.handleLoadTelecopyData();
                    //console.log(jobs)
                    let channels = Object.keys(jobs);
                    //console.log(channels)
                    channels.forEach((job)=>{
                        if(jobs[job]["status"]){
                            let box = jobs[job];
                            let sources = box["sources"];
                            let channel = box["chat_id"];
                            user.discord = client;
                            sources.forEach((source) => {
                                telecopy(user,source,channel);
                            });
                        }
                    });



    } 
}