const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    status: false,
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Returns Invite Link For This Bot')
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
            const invite = process.env.botInvite;
            
            if(option === pass){

                await interaction.editReply({
                    ephemeral: true,
                    content: invite
                });

            }else{
                await interaction.editReply({
                    ephemeral: true,
                    content: "Wrong Password"
                });

               // console.log(JSON.stringify('./srs/hooks/hook_'+channel+'.json'));
            }
        }
}