const { MessageEmbed } = require('discord.js');
const { removeReaction } = require('../utils');

async function load(client) {
  if (!client?.config?.support?.enabled) return;
  const ticketChannel = await client.channels.cache.get(client.config.support.channel);
  ticketChannel.messages.fetch({ limit: 100 }, true);
}

async function create(user, reaction, client) {
  await removeReaction(reaction.message, user);
  const channel = await client.guild.channels.create(`📁-${user.username}`);
  await channel.setParent(client.config.support.category);
  const supportRole = await client.guild.roles.resolve(client.config.support.roles.support);
  await channel.overwritePermissions([{
    id: client.config.support.roles.bot,
    allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
  }, {
    id: client.config.support.roles.support,
    allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
  }, {
    id: user.id,
    allow: ['VIEW_CHANNEL'],
  }, {
    id: client.config.support.roles.everyone,
    deny: ['VIEW_CHANNEL'],
  }]);
  await channel.setTopic(`${user.id}`);
  const helloEmbed = new MessageEmbed()
    .setTitle(`📁 Demande de ${user.username} - Request of ${user.username}`)
    .setColor(client.config.color.info)
    .setDescription(`Bienvenue ${user.username}, merci d'avoir ouvert une demande. N'hésite pas à nous donner le plus de détails possible pour t'aider au mieux. S'il s'agit d'un problème en jeu, tu peux aussi nous faire parvenir une capture d'écran du \`/debug\`. Merci ! :smile:\n\nWelcome ${user.username}, thank you for opening a request. Do not hesitate to give us as many details as possible to help you as much as possible. If it's an in-game problem, you can also send us a screenshot of the \`/debug\`. Thank you! :smile:`);
  await channel.send(helloEmbed);
  channel.send(`:arrow_right_hook: Mentions automatiques : ${supportRole} ${user}`).then((msg) => msg.delete({ timeout: 10000 }));
}

module.exports = { load, create };
