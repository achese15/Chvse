const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    status: false,
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Returns an embed'),
        async execute(interaction, client){

            await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });

            const embed = new EmbedBuilder()
            .setTitle('This Is An Embed')
            .setDescription('embed description')
            .setColor(client.color)
            .setImage(client.user.displayAvatarURL())
            .setAuthor({
                url: 'https://www.google.com',
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .setURL('https://www.google.com')
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag
            })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                {
                    name: 'Field',
                    value: 'Field Value'
                }
            ]);
            await interaction.editReply({
                embeds: [embed],
                ephemeral: true
            });
        }
}