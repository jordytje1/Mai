const ms = require('ms');

module.exports = {
	name: 'slowmode',
	aliases: ['slow', 'sm'],
	category: 'Moderation',
	description: 'Set the slowmode for a specific channel.',
	usage: 'slowmode [channel] <time>',
	run: async (bot, message, args) => {
		if(!message.member.hasPermission('BAN_MEMBERS')) {
			return message.channel.send(
				'<:vError:725270799124004934> You must have the following permissions to use that: Ban Members.',
			);
		}

		let channel = message.mentions.channels.first(),
			time = args.slice(1).join(' ');

		if (!channel) time = args.join(' '), channel = message.channel;

		if (args[0] === 'off') {
			channel.setRateLimitPerUser(0);
			return message.channel.send(`<:vSuccess:725270799098970112> Slowmode for <#${channel.id}> has been deactivated.`);
		}
		else{
			if (!time) return message.channel.send('<:vError:725270799124004934> Please include a valid time format.');

			const convert = ms(time);
			const toSecond = Math.floor(convert / 1000);

			if (!toSecond || toSecond == undefined) return message.channel.send('<:vError:725270799124004934> Please include a valid time format.');

			if (toSecond > 21600) return message.channel.send('<:vError:725270799124004934> Timer should be less than or equal to 6 hours.');
			else if (toSecond < 1) return message.channel.send('<:vError:725270799124004934> Timer should be more than or equal to 1 second.');

			await channel.setRateLimitPerUser(toSecond);
			return message.channel.send(
				`<:vSuccess:725270799098970112> Successfully set slowmode for <#${channel.id}> to **${ms(ms(time), { long: true })}**.`,
			);
		}
	},
};
