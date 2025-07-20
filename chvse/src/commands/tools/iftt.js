const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const fs = require('node:fs');

module.exports = {
    status: true,
    data: new SlashCommandBuilder()
        .setName('iftt')
        .setDescription('Create An IFTT Webhook For This Channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) => 
        option
        .setName("password")
        .setDescription('Administrator Password For This Server')
        .setRequired(true)
        ).addStringOption((option) => 
        option
        .setName("name")
        .setDescription('Name Of The New Hook')
        .setRequired(true)
        ),
        async execute(interaction, client){

            await interaction.deferReply({
                fetchReply: true,
                ephemeral: true,
            });

            const pass = process.env.iftt;
            const option = interaction.options.getString('password');
            const name = interaction.options.getString('name');
            const channel = interaction.channel.id;
            const hookFileName = 'hook_'+channel+'.json';
            const imageUrl = process.env.webhookAvatar;
            const link = process.env.webhookLink;
            //const hookFileName = 'first.json';
            const hookExists = fs.existsSync('./src/hooks/'+hookFileName);

            

            if(option === pass){
                
                if(!hookExists){

                    const hook = interaction.channel;

                    const wh = await hook.createWebhook({
                        name: name,
                        avatar: imageUrl
                    })
                    .then(async (webhook) => 
                            {
                                //const fs = require('node:fs');
                                const writeUp = {
                                    "name": name,
                                    "url": link,
                                    "image": imageUrl,
                                    "hook": webhook.url,
                                    "token": webhook.token,
                                    "channel": channel
                                };
                                const ref = JSON.stringify(writeUp);
                                
                                //console.log(webhook.url);
                                fs.writeFile('./src/hooks/'+hookFileName, ref, (err) => {
                                    if(err){
                                        console.log(err);
                                    }
                                });

                                const embed = new EmbedBuilder()
                                .setTitle(name)
                                .setDescription(webhook.url)
                                .setColor(client.color)
                                .setURL(link)
                                .setFooter({
                                    iconURL: client.user.displayAvatarURL(),
                                    text: interaction.channel.name
                                })
                                .setThumbnail(imageUrl);

                                await interaction.editReply({
                                    ephemeral: true,
                                    content: "New WebHook Successfully Created",
                                    embeds: [embed]
                                });

                            }
                                ).catch(console.error);


                }else{
                    //hook exists so reply with the hook details
                    const hookData = require('../../hooks/'+hookFileName);
                    const embed = new EmbedBuilder()
                    .setTitle(hookData.name)
                    .setDescription(hookData.hook)
                    .setColor(client.color)
                    .setURL(hookData.url)
                    .setFooter({
                        iconURL: client.user.displayAvatarURL(),
                        text: interaction.channel.name
                    })
                    .setThumbnail(hookData.image)
                    .addFields([
                        {
                            name: 'Lospollos Link',
                            value: hookData.url
                        }
                    ]);
                
                
                    await interaction.editReply({
                        ephemeral: true,
                        content: "Hook Exists For This Channel",
                        embeds: [embed]
                    });
                }
                  

            }else{
                await interaction.editReply({
                    ephemeral: true,
                    content: "Wrong Password"
                });

               // console.log(JSON.stringify('./srs/hooks/hook_'+channel+'.json'));
            }

          

        }
}