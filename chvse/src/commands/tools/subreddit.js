const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('subreddit')
        .setDescription('Builds A New Subreddit Listener For This Channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) => 
        option
        .setName("password")
        .setDescription('Administrator Password For This Server')
        .setRequired(true)
        ),
    async execute(interaction, client) {
        
        const pass = process.env.iftt;
        const option = interaction.options.getString('password');
            

        if(option === pass){
                const modal = new ModalBuilder()
                .setCustomId('subreddit')
                .setTitle('Reddit Feeds');

                const textInput = new TextInputBuilder()
                    .setCustomId('subreddit')
                    .setLabel('Subreddit')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Example: "games" (no /r/ infront)');
                
                const linkInput = new TextInputBuilder()
                    .setCustomId('link')
                    .setLabel('Button Link')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Affiliate Link');

                const buttonText = new TextInputBuilder()
                    .setCustomId('button')
                    .setLabel('Button Text')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Example: Click To Join!');

                const red = new ActionRowBuilder()
                .addComponents(textInput);

                const click = new ActionRowBuilder()
                .addComponents(buttonText);

                const link = new ActionRowBuilder()
                .addComponents(linkInput);

                modal.addComponents(red,link,click);

                await interaction.showModal(modal);

        }else{
            await interaction.reply({
                content: "Wrong Password",
                ephemeral: true
            });
        }
    }
} 