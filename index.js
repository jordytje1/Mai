// load env file (contains important keys)
require('dotenv').config();

const fs = require('fs');

const Client = require(`${process.cwd()}/struct/Client`);
const config = require(`${process.cwd()}/config`);

const client = new Client(config);

const options = {
  bypass: true,
  log: true,
  paths: [
    'action', 'anime', 'bot',
    'core', 'fun', 'moderation', 'music',
    'owner', 'setup', 'social','utility'
  ]
};

client.database?.init();

client.musicPlayer?.init();

client.loadCommands({ parent: 'commands', ...options });

client.loadEvents({ parent: 'events', ...options });

client.defineCollections([ 'discovery', 'economy', 'memes', 'xp' ]);

// let client listen to process events, setting ignore to true will
// ignore errors and not execute the functions from util/processEvents.js.
// Available process events on https://nodejs.org/api/process.html#process_process_events
client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });


client.on('message', async message => {
if(message.content == '!close') {
     message.channel.delete()
}
});


const discord = require("discord.js");
const { prefix, ServerID } = require("./config.json")
const configs = require('./config.json');
                             

client.on("channelDelete", (channel) => {
    if (channel.parentID == channel.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)

        if (!person) return;

        let yembed = new discord.MessageEmbed()
            .setAuthor("MAIL DELETED", client.user.displayAvatarURL())
            .setColor('RED')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription("Your mail is deleted by moderator and if you have any problem with that than you can open mail again by sending message here.")
        return person.send(yembed)

    }


})


client.on("message", async message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();


    if (message.guild) {

        if (command == "setup") {
            if (!message.content.startsWith(prefix)) return;
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.channel.send("You need Admin Permissions to setup the modmail system!")
            }

            if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
                return message.channel.send("Bot need Admin Permissions to setup the modmail system!")
            }


            let role = message.guild.roles.cache.find((x) => x.name == "Staff")
            let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

            if (!role) {
                role = await message.guild.roles.create({
                    data: {
                        name: "Staff",
                        color: "GREEN"
                    },
                    reason: "Role needed for ModMail System"
                })
            }

            await message.guild.channels.create("MODMAIL", {
                type: "category",
                topic: "All the mail will be here",
                permissionOverwrites: [
                    {
                        id: role.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    },
                    {
                        id: everyone.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    }
                ]
            })


            return message.channel.send("Setup is Completed ✅")

        } else if (command == "close") {
            if (!message.content.startsWith(prefix)) return;
            if (!message.member.roles.cache.find((x) => x.name == "Staff")) {
                return message.channel.send("You need `Staff` role to use this command")
            }
            if (message.channel.parentID == message.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {

                const person = message.guild.members.cache.get(message.channel.name)

                if (!person) {
                    return message.channel.send("I am Unable to close the channel and this error is coming because probaly channel name is changed.")
                }

                await message.channel.delete()

                let yembed = new discord.MessageEmbed()
                    .setAuthor("MAIL CLOSED", client.user.displayAvatarURL())
                    .setColor("RED")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter("Mail is closed by " + message.author.username)
                if (args[0]) yembed.setDescription(`Reason: ${args.join(" ")}`)

                return person.send(yembed)

            }
        } else if (command == "open") {
            if (!message.content.startsWith(prefix)) return;
            const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")

            if (!category) {
                return message.channel.send("Moderation system is not setuped in this server, use " + prefix + "setup")
            }

            if (!message.member.roles.cache.find((x) => x.name == "Staff")) {
                return message.channel.send("You need `Staff` role to use this command")
            }

            if (isNaN(args[0]) || !args.length) {
                return message.channel.send("Please Give the ID of the person")
            }

            const target = message.guild.members.cache.find((x) => x.id === args[0])

            if (!target) {
                return message.channel.send("Unable to find this person.")
            }


            const channel = await message.guild.channels.create(target.id, {
                type: "text",
                parent: category.id,
                topic: "Mail is Direct Opened by **" + message.author.username + "** to make contact with " + message.author.tag
            })

            let nembed = new discord.MessageEmbed()
                .setAuthor("DETAILS", target.user.displayAvatarURL({ dynamic: true }))
                .setColor("BLUE")
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                .setDescription(message.content)
                .addField("Name", target.user.username)
                .addField("Account Creation Date", target.user.createdAt)
                .addField("Direct Contact", "Yes(it means this mail is opened by a Staff)");

            channel.send(nembed)

            let uembed = new discord.MessageEmbed()
                .setAuthor("DIRECT MAIL OPENED")
                .setColor("GREEN")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription("You have been contacted by Staff of **" + message.guild.name + "**, Please wait until he send another message to you!");


            target.send(uembed);

            let newEmbed = new discord.MessageEmbed()
                .setDescription("Opened The Mail: <#" + channel + ">")
                .setColor("GREEN");

            return message.channel.send(newEmbed);
        } else if (command == "help") {
            if (!message.content.startsWith(prefix)) return;
            let embed = new discord.MessageEmbed()
                .setAuthor('MODMAIL BOT', client.user.displayAvatarURL())
                .setURL('https://flamebot.gq')
                .setColor("#FF0000")

                .setDescription("This bot is made by FiredragonPlayz") //Please Don't Remove Credits
                .addField("$setup", "Setup the modmail system(This is not for multiple server.)", true)

                .addField("$open", 'Let you open the mail to contact anyone with his ID', true)
                .setThumbnail(client.user.displayAvatarURL())
                .addField("$close", "Close the mail in which you use this command.", true);

            return message.channel.send(embed)

        }
    }







    if (message.channel.parentID) {

        const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")

        if (message.channel.parentID == category.id) {
            let member = message.guild.members.cache.get(message.channel.name)

            if (!member) return message.channel.send('Unable To Send Message')

            let lembed = new discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(message.content)

            return member.send(lembed)
        }


    }

    if (!message.guild) {
        const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => { })
        if (!guild) return;
        const category = guild.channels.cache.find((x) => x.name == "MODMAIL")
        if (!category) return;
        const main = guild.channels.cache.find((x) => x.name == message.author.id)


        if (!main) {
            let mx = await guild.channels.create(message.author.id, {
                type: "text",
                parent: category.id,
                topic: "This mail is created for helping  **" + message.author.tag + " **"
            })

            let sembed = new discord.MessageEmbed()
                .setAuthor("MAIL OPENED")
                .setColor("GREEN")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription("Conversation is now started, you will be contacted by staff soon")

            message.author.send(sembed)


            let eembed = new discord.MessageEmbed()
                .setAuthor("DETAILS", message.author.displayAvatarURL({ dynamic: true }))
                .setColor("BLUE")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(message.content)
                .addField("Name", message.author.username)
                .addField("Id", message.author.id)
                .addField("Account Creation Date", message.author.createdAt)
                .addField("Direct Contact", "No(it means this mail is opened by person not a staff)")


            return mx.send(eembed)
        }

        let xembed = new discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(message.content)


        main.send(xembed)

    }




})




const Discord = require('discord.js');
const client = new Discord.Client({
 partials: ['MESSAGE', 'USER', 'REACTION'],
});
const enmap = require('enmap');
const prefix = !

const settings = new enmap({
 name: 'settings',
 autoFetch: true,
 cloneLevel: 'deep',
 fetchAll: true,
});

client.on('ready', () => {
 console.log('Ticket System');
 client.user.setActivity(`Community`, { type: 'WATCHING' });
});

client.on('message', async (message) => {
 if (message.author.bot) return;
 if (message.content.indexOf(prefix) !== 0) return;

 const args = message.content
  .slice(prefix.length)
  .trim()
  .split(/ +/g);
 const command = args.shift().toLowerCase();

 if (command == 'ticket-setup') {


  if (message.author == '409327435188928526') {
   let channel = message.mentions.channels.first();
   if (!channel) return message.reply('Usage: `!ticket-setup`');

   let sent = await channel.send(
    new Discord.MessageEmbed()
     .setTitle('Ticket System')
     .setDescription(
      'If you want to buy something from us,\n react with‏‏‎ ‎‏‏‎ ‎ 🎫 ‏‏‎ ‎‏‏‎ ‎to open a ticket'
     )
     .setFooter(
      'Community',
      ''
     )
     .setColor('00f8ff')
   );

   sent.react('🎫');
   settings.set(`${message.guild.id}-ticket`, sent.id);

   message.channel.send('Ticket System Setup Done!');
  }
 }

 if (command == 'close') {
  if (!message.channel.name.includes('ticket-'))
   return message.channel.send('You cannot use that here!');
  message.channel.delete();
 }
});

client.on('messageReactionAdd', async (reaction, user) => {
 if (user.partial) await user.fetch();
 if (reaction.partial) await reaction.fetch();
 if (reaction.message.partial) await reaction.message.fetch();

 if (user.bot) return;

 let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

 if (!ticketid) return;

 if (reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
  reaction.users.remove(user);

  reaction.message.guild.channels
   .create(`ticket-${user.username}`, {
    permissionOverwrites: [
     {
      id: user.id,
      allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
     },
     {
      id: reaction.message.guild.roles.everyone,
      deny: ['VIEW_CHANNEL'],
     },
    ],
    type: 'text',
   })
   .then(async (channel) => {
    channel.send(
     `<@${user.id}> Welcome!`,
     new Discord.MessageEmbed()
      .setDescription(
       'Support will be with you shortly.\n \n !close to close the ticket.'
      )
      .setColor('00f8ff')
      .setFooter(
       'Community',
       ''
      )
      .setTimestamp()
    );
   });
 }
});









client.login();
