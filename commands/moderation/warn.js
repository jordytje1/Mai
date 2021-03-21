const Discord = require("discord.js")
const fs = require("fs");
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'warn',
	category: 'moderation',
	description: 'warn someone',
	aliases: ['warn'],
	usage: 'warn <user> <reason>',
	run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry, you dont have the right permissions to do this.");

    var user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!user) return message.channel.send("This user is not in this server.");
    
    if (user.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You cant warn staff.");

    var reason = args.join(" ").slice(22);

    if (!reason) return message.channel.send("Give me a reason.");

    const warns = require("../../assets/warnings.json");

    if (!warns[user.id]) warns[user.id] = {
        warns: 0
    };

    warns[user.id].warns++;

    fs.writeFile("././assets/warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err)
    });
//test
    const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#4955a9')
    .setTitle(`**WARN**`)
    .addField("warned user", user)
    .addField("gewarned by", message.author)
    .addField("reason", reason);
    let incidentchannel = message.guild.channels.cache.find(ch => ch.name === "logs")
    if(!incidentchannel) return message.channel.send("Cant find logs channel.");

    incidentchannel.send(exampleEmbed);

    message.channel.send(`:white_check_mark: Succesfully warned user: ${user}`);
	}
}
