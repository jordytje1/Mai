const { MessageEmbed } = require("discord.js")




module.exports = {
  name: 'ticket-setup',
  aliases: [ 'ticket-setup', 'ticket-set' ],
  group: 'ticket',
  description: 'Sends a list of all commands from each specific command groups',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [],
  examples: [
    'ticket-setup',
    'ticket-set',
  ],
callback: async(message, args) => {
        const channel = message.mentions.channels.first()
        if(!channel) return message.reply('Add A Channel To SetUp Ticket System.') // If No Channel Is Provided

        const embed = await channel.send(new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Ticket System')
        .setDescription('Need Help? Want To Talk To Staff? Having Problems?\nOpen Ticket')
        .setFooter('Ticket System')
        )
        // channel.send(embed).then(message => {
        //     message.react('🎫')
        // })
        console.log(embed.id) // For Creating Channel
        await embed.react('🎫') // React To Embed
        message.delete() // Delete Original Message
    }
}
