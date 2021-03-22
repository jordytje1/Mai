const { MessageEmbed, version: djsversion } = require('discord.js');
const moment = require('moment');
const os = require('os');
const cpuStat = require('cpu-stat');
const { owners } = require('/config.js')

module.exports = {
	name: 'botinfo',
	category: 'Info',
	description: 'Displays indept information about the bot.',
	cooldown: 10,
	aliases: ['bot', 'bi'],
	usage: 'botinfo',
	run: async (client, message, args) => {
		cpuStat.usagePercent(function(error, percent, seconds) {
			if(error) {
				return console.error(error);
			}
			const core = os.cpus()[0];
			const embed = new MessageEmbed()
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
				.setColor(client.displayHexColor || 'BLUE')
				.setFooter(`Requested by ${message.author.tag} `)
				.setTimestamp()
				.setTitle('Bot Information')
				.addFields(
					{ name: 'Bot Name', value: `\`\`\`${client.user.username}\`\`\``, inline:true },
					{ name: 'Bot ID', value: `\`\`\`${client.user.id}\`\`\``, inline:true },
					{ name: 'Bot Owner', value: `\`\`\`${client.users.cache.get(owners).tag}\`\`\`` },
					{ name: 'Servers', value: `\`\`\`${client.guilds.cache.size.toLocaleString()}\`\`\``, inline:true },
					{ name: 'Users', value: `\`\`\`${client.users.cache.size.toLocaleString()}\`\`\``, inline:true },
					{ name: 'Commands', value: `\`\`\`${client.commands.size}\`\`\``, inline:true },
					{ name: 'Uptime', value: `\`\`\`${parseDur(client.uptime)}\`\`\`` },
					{ name: 'Node.js Version', value: `\`\`\`${process.version}\`\`\``, inline:true },
					{ name: 'Discord.js Version', value: `\`\`\`v${djsversion}\`\`\``, inline:true },
					{ name: 'CPU', value: `\`\`\`${core.model}\`\`\`` },
					{ name: 'Created', value: `\`\`\`${moment(client.user.createdTimestamp).format('MMMM Do YYYY, h:mm:ss')} | ${Math.floor((Date.now() - client.user.createdTimestamp) / 86400000)} day(s) ago\`\`\`` },
				);
			message.channel.send(embed);
		});
	},
};
