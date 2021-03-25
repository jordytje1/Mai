const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'respect',
  aliases: [ 'f', 'rp', '+rp' ],
  group: 'fun',
  description: 'Show thy respect. Accepts arguments.',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'respect',
    'f Kyoto Animation',
    'rp @user',
  ],
  run: async (client, message, args) => {

    const rep = await message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setFooter(`Press F to pay respect | \©️${new Date().getFullYear()} 𝕯𝖗𝖆𝖌𝖔𝖓𝖇𝖔𝖞#6241`)
      .setDescription(`${message.member} has paid their respect${args.length ? ` to ${args.join(' ')}.` : ''}`)
    );

    await message.delete().catch(() => null);

    return rep.react("🇫")
  }
};
