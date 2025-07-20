const fs = require('fs');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = (client) => {
    client.handleJoins = async (member) => {
        fs.readFile("./src/data/join.txt", "utf-8", async (error, data) => {
            if(!error){
                            try {
                const dmChannel = await member.createDM();

                // 🧷 Buttons
                const buttonRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Free NSFW Adult Games')
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.handleLinks('adult')), // Replace with your server's rules URL

                new ButtonBuilder()
                    .setLabel('💬 Free Dating Site')
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.handleLinks('dating')) // You can change this to a channel invite
                );

                await dmChannel.send({
                content:data,
                components: [buttonRow],
                });

                console.log(`✅ Sent DM to ${member.user.tag}`);

            } catch (error) {
                console.log(`⚠️ Could not DM ${member.user.tag}: ${error.message}`);
            }
            }
        });
    }
}