const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    status: false,
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Returns A Button'),
        async execute(interaction, client){
            const button = new ButtonBuilder()
                .setCustomId('subyt')
                 .setLabel('Click Me')
                 .setStyle(ButtonStyle.Primary);

            await interaction.reply({
                components: [new ActionRowBuilder().addComponents(button)],
                ephemeral: true
            });
        }
}