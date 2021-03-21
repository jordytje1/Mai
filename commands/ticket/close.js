module.exports = {
  name: 'close',
  aliases: [ 'ct', 'close' ],
  group: 'ticket',
  description: 'Sends a list of all commands from each specific command groups',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [],
  examples: [
    'close',
    'ct',
  ],
    callback: (message, args) => {
        if(!message.channel.name.includes('ticket')) return message.reply('You Cant Delete A Normal Channel.') // If Non Ticket Channel Is Tried To Delete
        message.channel.delete()
    }
}
