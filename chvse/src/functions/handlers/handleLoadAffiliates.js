const { ActivityType } = require('discord.js');
const fs = require('fs');

function generateRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    return result;
  }


module.exports = (client) => {
    client.handleLoadAffiliates =  () => {
        let dataset = {};

            const copyFolders = fs.readdirSync('./src/data/affiliates');
            const copyFiles = copyFolders.filter((file) => file.endsWith('.json'));
            //console.log(copyFolders)
            for (const file of copyFiles){

                const copy = require('../../data/affiliates'+'/'+file);
                
                
                dataset[copy["name"]] = copy;

                //indicate that the command has registered
            // console.log('Command:'+command.data.name+' has passed through the handler');
            }
            return dataset;
        
    } 
}