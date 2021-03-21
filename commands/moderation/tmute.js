var Discord = require('discord.js');
var ms = require('ms');

module.exports = {
	name: 'tmute',
	category: 'moderation',
	description: 'What do you prefer? Red pandas or Pandas.',
	aliases: ['tmute'],
	usage: 'tmute',
	guildOnly: true,
	run: async (client, msg, args) => {
    if(!msg.member.hasPermission('KICK_MEMBERS')) return msg.reply('You cannot use this command!');

    var user = msg.mentions.users.first();
    if(!user) return msg.reply('tell me who you want to be muted');

    var member;

    try {
        member = await msg.guild.members.fetch(user);
    } catch(err) {
        member = null;
    }

    if(!member) return msg.reply('we cannot find that user');
    if(member.hasPermission('ADMINISTRATOR')) return msg.reply('You cannot mute that person!');

    var rawTime = args[1];
    var time = ms(rawTime);
    if(!time) return msg.reply('please tell me how long the user needs to get muted');

    var reason = args.splice(2).join(' ');
    if(!reason) return msg.reply('tell me the reason');

    const channel11 = msg.guild.channels.cache.find(c => c.name === 'logs');

    var log = new Discord.MessageEmbed()
    .setTitle('user muted')
    .addField('user:', user, true)
    .addField('by:', msg.author, true)
    .addField('time:', rawTime)
    .addField('reason:', reason)
     channel11.send(log);

    var embed = new Discord.MessageEmbed()
    .setTitle('you have been muted')
    .addField('time:', rawTime, true)
    .addField('reason:', reason, true)
    .addField('guild', (`${member.guild.name}`), true);

    try {
        user.send(embed);
    } catch(err) {
        console.warn(err);
    }

    var role = msg.guild.roles.cache.find(r => r.name === 'Muted');

    member.roles.add(role);

    setTimeout(async() => {
        member.roles.remove(role);
    }, time);

    msg.channel.send(`**${user}** Foi mutado por **${msg.author}** por **${rawTime}** !`);
	}
}
