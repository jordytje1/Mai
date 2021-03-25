const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'color',
  aliases: [ 'colour', 'hex' ],
  group: 'utility',
  description: 'Shows a random color or a preview of the given color',
  parameters: [ 'hex code' ],
  examples: [
    'color',
    'color #ffffff'
  ],
  run: (client, message, [ hex = '']) => {

    const color = hex.match(/[0-9a-f]{6}/) ||
    Math.floor(Math.random() * 16777215).toString(16)

    return message.channel.send(
      new MessageEmbed()
      .setColor(`#${color}`)
      .setImage('https://dummyimage.com/200/' + color)
      .setFooter(`Color ${color} | \©️${new Date().getFullYear()} 𝕯𝖗𝖆𝖌𝖔𝖓𝖇𝖔𝖞#6241`)
    );
  }
};
