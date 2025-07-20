const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const fs = require('node:fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update All Reddit Feeds.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) => 
        option
        .setName("password")
        .setDescription('Administrator Password For This Server')
        .setRequired(true)
        ),
        async execute(interaction, client){
            await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });

            const pass = process.env.iftt;
            const option = interaction.options.getString('password');
            
            if(option === pass){
                client.SubRedditListener();
                await interaction.editReply({
                    ephemeral: true,
                    content: "Updating All Reddit Feeds"
                });

                

            }else{
                await interaction.editReply({
                    ephemeral: true,
                    content: "Wrong Password"
                });
            }

        }
}