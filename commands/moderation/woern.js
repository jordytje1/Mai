const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");




module.exports = {
	name: 'woern',
	category: 'moderation',
	description: 'Feeling bored? Get some activities to do.',
	aliases: [],
	usage: 'woern <@user> <reason>',
	run: async (bot, message, args) => {


if (!message.member.hasPermission("MANAGE_MESSAGES")) return  message.channel.send({embed: { color: 0xFF0000, title: "» Error!", description: "You do not have the permission required", footer: { text: "Permission Rrquired: MANAGE_MESSAGES"} } }).catch(console.error);
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply({embed: { color: 0xFF0000, title: "» Error!", description: "User could not be found!" } }).catch(console.error);
  if(wUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send({embed: { color: 0xFF0000, title: "» Error!", description: "Could not warn the user. He/She's way too cool!" } }).catch(console.error);
  let reason = args.join(" ").slice(22);
    if (message.mentions.users.size < 1) return message.reply({embed: { color: 0xFF0000, title: "» Error!", description: "You must mention a user to warn!" } }).catch(console.error);
      if (reason.length < 1) return message.reply({embed: { color: 0xFF0000, title: "» Error!", description: "You must specify a reason!" } }).catch(console.error);

  // We ensure that the user exists ( makes sure the user exists in the db and returns if they don't)
   bot.warns.ensure(`${message.guild.id}-${wUser.id}`, { // Ensure
        user: wUser.id,
        warns: 0
      });
      bot.warns.math(`${message.guild.id}-${wUser.id}`, "+", 1, "warns")  // Right here we will add 1 to the user where warns

  let warnEmbed = new Discord.RichEmbed()
  .setColor(0xffff00)
  .setTitle(`:warning: **Warn**`)
  .addField("User:", `<@${wUser.id}>`, true)
  .addField("Warned in:", message.channel, true)
  .addField("Reason:", reason);

  let warnchannel = message.guild.channels.find(`name`, "modlogs");
  if(!warnchannel) return message.channel.send({embed: { color: 0xFF0000, title: "» Error!", description: "Couldn't find a modlogs!" } }).catch(console.error);

  warnchannel.send(warnEmbed);
      message.channel.send({embed: { color: 0xFFFFFF, title: "» Success!", description: "User has been warned!"} }).catch(console.log("ERROR HANDLED")).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: 'warn',
  description: 'Warns the user',
  usage: 'warn <@user> <reason>'
};
