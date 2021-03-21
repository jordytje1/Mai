const { MessageEmbed } = require("discord.js")

module.exports = (client) => {
    client.on('messageReactionAdd', (reaction, user) => {
        if(reaction.message.id === '823277848722145360' && reaction.emoji.name === '🎫') { // If Reaction Is Used In Message ID Provided // Emoji Should Be Same As Used In setup.js
            reaction.users.remove(user)

            reaction.message.guild.channels.create(`ticket-${user.username}`, {
                permissionOverwrites: [
                    { // For User Who Created Channel Using Reaction
                        id: user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    },
                    { // For EveryOne In Server
                        id: reaction.message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    { // For Mod, Admin etc... // Add As Many As You Like
                        id: '376384142599782410',
                        allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES','MANAGE_CHANNELS'] //Add As Many As You Like
                    },
                    { // For Mod, Admin etc...
                        id: '376384142599782410',
                        allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES','MANAGE_CHANNELS'] //Add As Many As You Like
                    }
                ],
                type : 'text', parent: '823278205262888970' // type:text For Text Channel and parent:810399250336186398 For In Which Category You Want the Ticket Channel To Be Created
            }).then(async channel => {
                channel.send(`<@${user.id}> Welcome!`, new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Welcome To Your Ticket')
                .setDescription('Please Provide Your Issues')
                .setTimestamp()
                .setFooter(`Ticket For ${user.username}#${user.discriminator}`)
                )
            })
        }
    })
}
