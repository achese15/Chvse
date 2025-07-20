const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const fs = require('node:fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('bump')
        .setDescription('Bump Us!!')
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
                
                await interaction.editReply({
                    ephemeral: true,
                    content: "Doing Some Partnerships!!"
                });

                for (let i = 0; i < process.env.loop; i++) { 
  client.handlePartners();
}  

            }else{
                await interaction.editReply({
                    ephemeral: true,
                    content: "Wrong Password"
                });
            }

        }
}