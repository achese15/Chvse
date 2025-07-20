const { ActivityType } = require('discord.js');
const fs = require('fs');

module.exports = (client) => {
    client.handleLoadTelecopyData =  () => {
        let dataset = {};

            const copyFolders = fs.readdirSync('./src/data/telecopy');
            const copyFiles = copyFolders.filter((file) => file.endsWith('.json'));
            //console.log(copyFolders)
            for (const file of copyFiles){

                const copy = require('../../data/telecopy'+'/'+file);
                const key = copy["chat_id"];
                
                dataset[key] = copy;

                //indicate that the command has registered
            // console.log('Command:'+command.data.name+' has passed through the handler');
            }
            return dataset;
        
    } 
}