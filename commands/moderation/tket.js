const channelId = '823270008134041641';
const check = '✅';
let registered = false;
const registerEvent = (client) => {
    if(registered) {
        return console.log(1);
    }

    registered=true;

    console.log('Registered');

    client.on('messageReactionAdd', (reaction, user) => {
        if(user.bot) {
            return console.log(2);
        }

        console.log('Handling reaction');

        const {message} = reaction;
        if(message.channel.id === channelId) {
            message.delete();
        }
    })
}
module.exports = {
	name: 'ticket',
	description: 'Create a ticket',
	minArgs: 1,
    expectedArgs: '<message>',
	category: 'Moderation',
    ownerOnly: true,
    guildOnly: true,
    //permissions: ['KICK_MEMBERS'],
	callback: ({message, args, text, client, prefix, instance}) => {
            const { guild, member } = message
            registerEvent(client)
            const channel = guild.channels.cache.get(channelId);
            channel.send(`Ein neues ticket wurde von <@${member.id}> erstellt.
            "${text}"
            
            
            Um das ticket zu schließen, klicke ${check}.`)
            .then(ticketMessgae => {
                ticketMessgae.react(check)

            message.reply(
                `Dein ticket wurde erstellt, du wirst eine antwort in innherhalb eines Tages erhalten-`
            )
            message.delete();
            })
            
    }
}
