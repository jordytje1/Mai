module.exports = {
	name: 'addrole',
	category: 'Moderation',
	description: 'Adds a role to a specified user.',
	aliases: [],
	usage: 'addrole <user> <role>',
	guildOnly: true,
	run: async (client, message, args) => {
		if(!message.member.hasPermission('MANAGE_ROLES')) {
			return message.channel.send(
				'<:vError:725270799124004934> You must have the following permissions to use that: Manage Roles.',
			);
		}

		if(!message.guild.me.hasPermission('MANAGE_ROLES')) {
			return message.channel.send(
				'<:vError:725270799124004934> I must have the following permissions to use that: Manage Roles.',
			);
		}

		const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
		if(!role) {
			return message.channel.send(
				'<:vError:725270799124004934> Please provide a valid role.',
			);
		}

		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(' ') || x.user.username === args[0]);
		if (!member) {
			return message.channel.send(
				'<:vError:725270799124004934> Please provide a valid user.',
			);
		}

		if(member.id === message.author.id) {
			return message.channel.send(
				'<:vError:725270799124004934> You are not allowed to give yourself roles.',
			);
		}

		if(member.id === message.guild.owner.id) {
			return message.channel.send(
				'<:vWarning:725276167346585681> What do you want to add?',
			);
		}

		member.roles.add(role);
		await message.channel.send(
			`<:vSuccess:725270799098970112> Successfully gave ${role.name} to **${member.user.username}**#${member.user.discriminator}`,
		).then(message.delete());
	},
};
