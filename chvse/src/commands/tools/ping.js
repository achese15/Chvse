const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns Bot Owner'),
        async execute(interaction, client){
            await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });

            const newMessage = 'BotGHOST: Hisenberg!!!!';
            
            await interaction.editReply({
                ephemeral: true,
                content: newMessage
            });
        }
}