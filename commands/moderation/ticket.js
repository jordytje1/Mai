module.exports = {
	name: 'setup',
	alias: ['set'],
	args: {
		value: false,
	},
	guildOnly: true,
	ownerOnly: false,
	disabled: false,
	run: async (msg, args) => {
    if (msg.author.id !== msg.guild.ownerID) return msg.reply('only owner of the guild can use this command.');
    if (args.length === 0) {
      msg.channel.send('This dialog will help you configure the bot.\nNow only one setting is available (staff role). 😦\nEnter a role name for staff.')
      .then(() => {
        msg.channel.awaitMessages(m => m.author.id === msg.guild.ownerID, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          let role = msg.guild.roles.find(role => role.name.includes(collected.first().content));
          if (role === null) {
            msg.reply('cannot find the role you given. Create it? [**yes**, **no**]')
            .then(() => {
              msg.channel.awaitMessages(m => m.author.id === msg.guild.ownerID, { max: 1, time: 60000, errors: ['time'] })
              .then(coll => {
                if (coll.first().content === 'yes') {
                  msg.guild.createRole({ name: collected.first().content, color: 'RANDOM' })
                  .then(role => {
                    msg.reply(`successefully created **${role.name}**.`);
                    settings.set(msg.guild.id.toString(), { staffRole: collected.first().content, setup: true });
                  })
                  .catch(roleError => {
                    console.error(roleError);
                    msg.reply(`something wrong. Here's a tip that can help you.\nMaybe I have no permissions?\n\tMANAGE_ROLES: **${msg.guild.me.hasPermission(['MANAGE_ROLES'])}**\n\tADMINISTRATOR: **${msg.guild.me.hasPermission(['ADMINISTRATOR'])}**`);
                  });
                } else {
                  msg.reply('ok. Aborting.');
                }
              })
            })
            .catch(e => console.error(e));
          } else settings.set(msg.guild.id.toString(), { staffRole: collected.first().content, setup: true });
        })
        .catch(error => console.error(error));
      })
      .catch(err => console.error(err));
    } else if (args.length > 1) {
      let arg = args.shift().toString();
      switch (arg) {
        case 'staffRole':
          msg.guild.createRole({ name: args[0], color: 'RANDOM' })
          .then(role => {
            msg.reply(`successefully created **${role.name}**.`);
            settings.set(msg.guild.id.toString(), { staffRole: args[0] });
          })
          .catch(roleError => {
            console.error(roleError);
            msg.reply(`something wrong. Here's a tip that can help you.\nMaybe I have no permissions?\n\tMANAGE_ROLES: **${msg.guild.me.hasPermission(['MANAGE_ROLES'])}**\n\tADMINISTRATOR: **${msg.guild.me.hasPermission(['ADMINISTRATOR'])}**`);
          });
          break;
        default:
          msg.reply('this does nothing. Keep do what you do.');
      }
    } else {
      msg.reply('it does nothing. Keep do what you do.');
    }
	}
};
