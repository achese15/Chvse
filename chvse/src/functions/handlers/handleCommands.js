//this file processes commands from the command folder and registers them
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');


module.exports = (client) => {
    client.handleCommands = async() => {
        const commandFolders = fs.readdirSync('./src/commands');
        for (const folder of commandFolders){
            const commandFiles = fs.readdirSync('./src/commands/'+folder)
            .filter((file) => file.endsWith('.js'));
            
            const { commands, commandArray } = client;

            for (const file of commandFiles){

                const command = require('../../commands/'+folder+'/'+file);

                if(command.status){
                        commands.set(command.data.name, command);
                        commandArray.push(command.data.toJSON());
                    }

                //indicate that the command has registered
               // console.log('Command:'+command.data.name+' has passed through the handler');
            }
        }
        const clientId = process.env.bot;
        const guildId = '';
        const rest = new REST({ VERSIOB: '9' }).setToken(process.env.token);

        try {
            console.log('Started Refreshing Application (/) Commands');

            await rest.put(Routes.applicationCommands(clientId), {
                body: client.commandArray
            });

            console.log('Successfully reloaded application (/) commands');

        }catch(error){
            console.log(error);
        }

    }

    
}