const Discord = require('discord.js')
const path = require('path')
module.exports = (client, options) => {
  const MODMAIL_SERVER = {
    id: (options && options.id) || "",
    categoryID: (options && options.categoryID) || "",
    loggingID: (options && options.loggingID) || "",
    method: (options && options.method) || 0,
    depth: (options && options.depth) || 0,
    cooldown: Boolean((options && options.cooldown)),
    limitedMsg: Boolean((options && options.limitedMsg)),
    reasonAlert: Boolean((options && options.reasonAlert)),
    logStaff: Boolean((options && options.logStaff)),
    webhookEmbeds: Boolean((options && options.webhookEmbeds)),
    prefix: (options && options.prefix) || "!",
    help: (options && options.help) || "help",
    reply: (options && options.reply) || "reply",
    close: (options && options.close) || "close",
    errors: (options && options.errors) || "errors",
    imageExtensions: new Set(require('./extensions.json').images),
    unsafeExtensions: new Set(require('./extensions.json').unsafe)
  }

  function verifyFile(f) {
    if (MODMAIL_SERVER.imageExtensions.has(path.extname(f).slice(1).toLowerCase())) return true
    else if (MODMAIL_SERVER.unsafeExtensions.has(path.extname(f).slice(1).toLowerCase())) return false
    else false
  }

  function isImage(f) {
    return MODMAIL_SERVER.imageExtensions.has(path.extname(f).slice(1).toLowerCase())
  }

  function logMessage(message, options = {response: 0, user: null, id: null, cnt: null, atch: [], to: null, reason: null, staff: null}) {
    return new Promise((res, rej) => {
      if (options.user == null) rej(new Error("user was not passed for logMessage"))
      const embed = new Discord.MessageEmbed()
      if (options.response == 0 || options.response == "normal") embed.setTitle(`Response Recived: ${options.user.username}`).setColor("GOLD").addField("User ID", options.user.id, true).addField("Channel ID", options.id, true).setThumbnail(options.user.displayAvatarURL()).setDescription(`${options.cnt ? options.cnt : `[No message content]`}`+`${options.atch && options.atch.length>0 ? options.atch.map(index => { return `\n[Attachment URL](${index.url}) [${index.name.split(".")[1].toUpperCase()}]` }).join("") : ""}`)
      else if (options.response == 1 || options.response == "staff" && MODMAIL_SERVER.logStaff) embed.setTitle(`Staff Talk: ${options.user.username}`).setColor("AQUA").addField("User ID", options.user.id, true).addField("Channel ID", options.id, true).setThumbnail(options.user.displayAvatarURL()).setDescription(options.cnt)
      else if (options.response == 2 || options.response == "reply") embed.setTitle(`Reply Sent: ${options.user.username}`).setColor("GOLD").addField("Staff Member", `${options.staff.username} (${options.staff.id})`, true).addField("Sent to", `${options.user.username} (${options.user.id})`, true).setThumbnail(options.user.displayAvatarURL()).setDescription(`${options.cnt ? options.cnt : `[No message content]`}`+`${options.atch && options.atch.length>0 ? options.atch.map(index => { return `\n[Attachment URL](${index.url}) [${index.name.split(".")[1].toUpperCase()}]` }).join("") : ""}`)
      else if (options.response == 3 || options.response == "delete") embed.setTitle(`Channel Closed: ${options.user.username}`).setColor("RED").addField("Staff Member", `${options.staff.username} (${options.staff.id})`, true).addField("Reason", options.reason ? options.reason : "No reason given", true).setThumbnail(options.user.displayAvatarURL())
      else if (options.response == 4 || options.response == "create") embed.setTitle(`Channel Opened: ${options.user.username}`).setColor("GREEN").setThumbnail(options.user.displayAvatarURL()).addField("User ID", `${options.user.id}`, true)
      res(client.channels.cache.get(MODMAIL_SERVER.loggingID).send(embed))
    });
  }

  function elevation(message) {
    let permlvl = 0;
    if (message.member.permissions.has("KICK_MEMBERS")) permlvl = 1;
    if (message.member.permissions.has("BAN_MEMBERS")) permlvl = 2;
    if (message.member.permissions.has("ADMINISTRATOR")) permlvl = 3;
    if (message.member.id === message.member.guild.ownerID) permlvl = 4;
    return permlvl;
  }

  client.on("message", async (message) => {
    if (message.channel.type == "dm" && !message.author.bot) {
      switch (MODMAIL_SERVER.method) {
        case 0: {
          const info = {id: message.author.id, cnt: message.content, attachments: [], avatarURL: message.author.displayAvatarURL({format: "png", size: 256})}
          const guild =  await message.client.guilds.fetch(MODMAIL_SERVER.id, true, true)
          if (!guild || !guild.id) return console.error(new Error("failed to fetch guild with " + MODMAIL_SERVER.id))
          var channel = await guild.channels.cache.find(c => c.topic == `${info.id}`)
          if (!channel || channel.size == 0) {
            channel = await guild.channels.create(`${message.author.username}`, { type: "text", topic: `${info.id}`, parent: MODMAIL_SERVER.categoryID }).catch(e => {
              message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: CREATE_${message.author.id}`)
              console.error(`CREATE_${message.author.id} ` + e.stack ? e.stack : e)
            })
            if (channel && channel.type) {
              logMessage(message, {response: 4, user: client.users.cache.get(channel.topic.trim())})
              message.author.send(`Your Mod Mail submission has been sent to the staff of \`${guild.name}\`. You will be sent responses in this DM. Messages sent to the staff will be reacted with a ✅. Images will also send with your messages.`)
            }
          }
          else channel = channel.type ? await channel.fetch(true) : await channel.first().fetch(true)
          var webhook = await channel.fetchWebhooks()
          if (!webhook || webhook.size == 0) webhook = await channel.createWebhook(`${info.id}`, {avatar: info.avatarURL, reason: `ModMail Hook for: ${info.id}`}).catch(e => {
            console.error(`CHOOK_${message.author.id} ` + e.stack ? e.stack : e)
            return message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: CHOOK_${message.author.id}`)
          })
          else webhook = webhook.first()
          if (message.attachments.size > 0) {
            message.attachments.each(m => {
              if (verifyFile(m.name)) info.attachments.push({image: {url: m.url}, color: 10040319, description: `[Attachment URL](${m.url}) [${m.name.split(".")[1].toUpperCase()}]`})
              else info.attachments.push({image: {url: m.url}, color: 10040319, description: `[Attachment URL](${m.url}) [${m.name.split(".")[1].toUpperCase()}]: WARNING: File might be harmful`})
            })

            if (MODMAIL_SERVER.webhookEmbeds) info.attachments.unshift({thumbnail: {url: message.author.displayAvatarURL({format:"png"})}, description:info.cnt, color:16766720, title:message.author.username})
            webhook.send(MODMAIL_SERVER.webhookEmbeds ? " " : (info.cnt.length > 0 ? info.cnt : "*[No message content, but images were attached]*"), {
              username: message.author.username,
              avatarURL: info.avatarURL,
              embeds: info.attachments
            }).then(() => {
              message.react("✅")
              var a = []
              message.attachments.each(m => a.push({url: m.url, name: m.name}))
              logMessage(message, {response: 0, user: client.users.cache.get(channel.topic), id: channel.id, cnt: info.cnt ? info.cnt : "", atch: a})
            }).catch(e => {
              console.error(`SHOOK_${message.author.id} ` + e.stack ? e.stack : e)
              return message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: SHOOK_${message.author.id}`)
            })
          } else {
            if (MODMAIL_SERVER.webhookEmbeds) info.attachments.unshift({thumbnail: {url: message.author.displayAvatarURL({format:"png"})}, description:info.cnt, color:16766720, title:message.author.username})
            webhook.send(MODMAIL_SERVER.webhookEmbeds ? "" : (info.cnt.length > 0 ? info.cnt : "*[No message content]*"), {
              username: message.author.username,
              avatarURL: info.avatarURL,
              embeds: MODMAIL_SERVER.webhookEmbeds ? info.attachments : []
            }).then(() => {
              message.react("✅")
              logMessage(message, {response: 0, user: client.users.cache.get(channel.topic), id: channel.id, cnt: info.cnt ? info.cnt : ""})
            }).catch(e => {
              console.error(`SHOOK_${message.author.id} ` + e.stack ? e.stack : e)
              return message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: SHOOK_${message.author.id}`)
            })
          }
          break;
        }
        case 1: {
          const info = {id: message.author.id, cnt: message.content, attachments: [], avatarURL: message.author.displayAvatarURL({format: "png", size: 256})}
          const guild =  await message.client.guilds.fetch(MODMAIL_SERVER.id, true, true)
          if (!guild || !guild.id) return console.error(new Error("failed to fetch guild with " + MODMAIL_SERVER.id))
          var channel = await guild.channels.cache.find(c => c.topic == `${info.id}`)
          if (!channel || channel.size == 0) {
            channel = await guild.channels.create(`${message.author.username}`, { type: "text", topic: `${info.id}`, parent: MODMAIL_SERVER.categoryID }).catch(e => {
              message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: CREATE_${message.author.id}`)
              console.error(`CREATE_${message.author.id} ` + e.stack ? e.stack : e)
            })
            if (channel && channel.type) {
              logMessage(message, {response: 4, user: client.users.cache.get(channel.topic.trim()), reason: args[0] ? args.join(" ") : false})
              message.author.send(`Your Mod Mail submission has been sent to the staff of \`${guild.name}\`. You will be sent responses in this DM. Messages sent to the staff will be reacted with a ✅. Images will also send with your messages.`)
            }
          }
          else channel = channel.type ? await channel.fetch(true) : await channel.first().fetch(true)
          if (message.attachments.size > 0) {
            const embed = new Discord.MessageEmbed()
            var links = []
            message.attachments.each(m => {
              if (verifyFile(m.name)) links.push(`[Attachment URL](${m.url}) [${m.name.split(".")[1].toUpperCase()}]`)
              else links.push(`[Attachment URL](${m.url}) [${m.name.split(".")[1].toUpperCase()}]: WARNING: File might be harmful`)
            })
            links = links.join("\n")
            embed.setColor("PURPLE")
            embed.setDescription(links)
            channel.send(info.cnt.length > 0 ? info.cnt : "*[No message content]*", {embed}).then(() => {
              message.react("✅")
              var a = []
              message.attachments.each(m => a.push({url: m.url, name: m.name}))
              logMessage(message, {response: 0, user: client.users.cache.get(channel.topic), id: channel.id, cnt: info.cnt ? info.cnt : "", atch: a})
            }).catch(e => {
              console.error(`SMSG_${message.author.id} ` + e.stack ? e.stack : e)
              return message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: SMSG_${message.author.id}`)
            })
          } else {
            channel.send(info.cnt.length > 0 ? `New Message: ${info.cnt}` : "*[No message content]*").then(() => {
              message.react("✅")
              logMessage(message, {response: 0, user: client.users.cache.get(channel.topic), id: channel.id, cnt: info.cnt ? info.cnt : ""})
            }).catch(e => {
              console.error(`SMSG_${message.author.id} ` + e.stack ? e.stack : e)
              return message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: SMSG_${message.author.id}`)
            })
          }
          break;
        }
        default: {
          const info = {id: message.author.id, cnt: message.content, attachments: [], avatarURL: message.author.displayAvatarURL({format: "png", size: 256})}
          const guild =  await message.client.guilds.fetch(MODMAIL_SERVER.id, true, true)
          if (!guild || !guild.id) return console.error(new Error("failed to fetch guild with " + MODMAIL_SERVER.id))
          var channel = await guild.channels.cache.find(c => c.topic == `${info.id}`)
          if (!channel || channel.size == 0) {
            channel = await guild.channels.create(`${message.author.username}`, { type: "text", topic: `${info.id}`, parent: MODMAIL_SERVER.categoryID }).catch(e => {
              message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: CREATE_${message.author.id}`)
              console.error(`CREATE_${message.author.id} ` + e.stack ? e.stack : e)
            })
            if (channel && channel.type) {
              logMessage(message, {response: 4, user: client.users.cache.get(channel.topic.trim()), reason: args[0] ? args.join(" ") : false})
              message.author.send(`Your Mod Mail submission has been sent to the staff of \`${guild.name}\`. You will be sent responses in this DM. Messages sent to the staff will be reacted with a ✅. Images will also send with your messages.`)
            }
          }
          else channel = channel.type ? await channel.fetch(true) : await channel.first().fetch(true)
          var webhook = await channel.fetchWebhooks()
          if (!webhook || webhook.size == 0) webhook = await channel.createWebhook(`${info.id}`, {avatar: info.avatarURL, reason: `ModMail Hook for: ${info.id}`}).catch(e => {
            console.error(`CHOOK_${message.author.id} ` + e.stack ? e.stack : e)
            return message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: CHOOK_${message.author.id}`)
          })
          else webhook = webhook.first()
          if (message.attachments.size > 0) {
            message.attachments.each(m => {
              if (verifyFile(m.name)) info.attachments.push({image: {url: m.url}, color: 10040319, description: `[Attachment URL](${m.url}) [${m.name.split(".")[1].toUpperCase()}]`})
              else info.attachments.push({image: {url: m.url}, color: 10040319, description: `[Attachment URL](${m.url}) [${m.name.split(".")[1].toUpperCase()}]: WARNING: File might be harmful`})
            })
            webhook.send(info.cnt.length > 0 ? info.cnt : "*[No message content, but images were attached]*", {
              username: message.author.username,
              avatarURL: info.avatarURL,
              embeds: info.attachments
            }).then(() => {
              message.react("✅")
              var a = []
              message.attachments.each(m => a.push({url: m.url, name: m.name}))
              logMessage(message, {response: 0, user: client.users.cache.get(channel.topic), id: channel.id, cnt: info.cnt ? info.cnt : "", atch: a})
            }).catch(e => {
              console.error(`SHOOK_${message.author.id} ` + e.stack ? e.stack : e)
              return message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: SMSG_${message.author.id}`)
            })
          } else {
            webhook.send(info.cnt.length > 0 ? info.cnt : "*[No message content]*", {
              username: message.author.username,
              avatarURL: info.avatarURL
            }).then(() => {
              message.react("✅")
              logMessage(message, {response: 0, user: client.users.cache.get(channel.topic), id: channel.id, cnt: info.cnt ? info.cnt : ""})
            }).catch(e => {
              console.error(`SHOOK_${message.author.id} ` + e.stack ? e.stack : e)
              return message.reply(`There was an error with the ModMail system, please contact staff to get it resolved.\nError: SMSG_${message.author.id}`)
            })
          }
        }
      }

    }

    if (message.content.startsWith(MODMAIL_SERVER.prefix)) {
      const command = message.content.substring(MODMAIL_SERVER.prefix.length).split(/[ \n]/)[0].trim()
      const args = message.content.slice(MODMAIL_SERVER.prefix.length + command.length).trim().split(/ +/g)

      switch (command) {
        case MODMAIL_SERVER.help: {
          const embed = new Discord.MessageEmbed()
          .setTitle("MailMod Help")
          .setThumbnail(message.client.user.displayAvatarURL({format: "png"}))
          .setDescription(`Messaging me will open a back and forth chat with you and staff in \`${message.client.guilds.cache.get(MODMAIL_SERVER.id).name}\`. Any replies will be sent to you in this DM. You may attach files if needed. Any messages sent will be reacted with a ✅. You will also be told when your submission is "closed."`)
          .addField("Normal Commands", `${MODMAIL_SERVER.help}, ${MODMAIL_SERVER.errors}`)
          .addField("Staff Commands", `${MODMAIL_SERVER.reply}, ${MODMAIL_SERVER.close}`)
          .setColor(10040319)
          message.author.send({embed}).catch(console.log)
          break;
        }
        case MODMAIL_SERVER.reply: {
          if (elevation(message) > 1) {
            const channel = await message.channel.fetch(true)
            if (channel.parentID !== MODMAIL_SERVER.categoryID || channel.id == MODMAIL_SERVER.loggingID) return;
            const user = await message.client.users.fetch(channel.topic.trim(), true, true)
            if (!user) return message.reply(`I couldn't find a user matching \`${channel.topic}\`. Please make sure the topic for this channel is only the user ID it was created with.`)
            if (!args[0]) return message.reply(`you need to give me something to send back to ${user.username}.`)
            if (message.attachments.size > 0) {
              const embed = new Discord.MessageEmbed()
              .setColor(10040319)
              .setImage(message.attachments.first().url)
              .setDescription(`[Attachment URL](${message.attachments.first().url}) [${message.attachments.first().name.split(".")[1].toUpperCase()}]`)
              user.send(`**[${message.guild.name}]**: ${args.join(" ")}`, {embed}).then(() => {
                message.reply("your message has been sent.")
                logMessage(message, {response: 2, staff: message.author, user: user, cnt: args[0] ? args.join(" ") : false, atch: [{url: message.attachments.first().url, name: message.attachments.first().name}]})
              })
            } else {
              user.send(`**[${message.guild.name}]**: ${args.join(" ")}`).then(() => {
                message.reply("your message has been sent.")
                logMessage(message, {response: 2, staff: message.author, user: user, cnt: args[0] ? args.join(" ") : false})
              })
            }
          }
          break;
        }
        case MODMAIL_SERVER.errors: {
          if (!args) return message.reply("you must give me a command code (e.g, SET_PARENT, SMSG, or CREATE). Error codes are case sensitive.")
          switch (args[0]) {
            case "SET_PARENT": {
              message.reply("\`SET_PARENT\` occurs when the bot couldn't set the category for a channel. Make sure it has Manage Channel and Manage Message. If this still persists you may need to give it Administrator as a work around.")
              break;
            }
            case "SMSG": {
              message.reply("\`SMSG\` occurs when the bot couldn't send a message to a user or to a channel. This will happen if the bot either doesn't have Send Messages permissions or the user doesn't allow direct messages from the server. The ending number for this error is the user ID it was messaging for. This ID will be in the channels topic.")
              break;
            }
            case "CREATE": {
              message.reply("\`CREATE\` occurs when the bot couldn't create a channel. Usually from the bot lacking Manage Channels permissions, similar to \`SET_PARENT\`.")
              break;
            }
            case "SHOOK": {
              message.reply("\`SHOOK\` occurs when the bot couldn't send a message through a webhook (when method 0 is set). The bot shouldn't _need_ permissions to use a hook. The ending number for this error is the user ID it was messaging for. This ID will be in the channels topic. You can either check that the integrations for the server has the webhook, or delete the channel.")
              break;
            }
            case "CHOOK": {
              message.reply("\`CHOOK\` occurs when the bot couldn't create a webhook (when method 0 is set). Make sure the bot has Manage Webhook permissions and that the bot can create and see channels within the category that channels go to. The ending number for this error is the user ID it was messaging for. This ID will be in the channels topic.")
              break;
            }
            default: {
              message.reply("you must give me a command code (e.g, SET_PARENT, SMSG, or CREATE). Error codes are case sensitive.")
            }
          }
          break;
        }
        case MODMAIL_SERVER.close: {
          if (elevation(message) > 1) {
            const num = Math.floor(1000 + Math.random() * 9000)
            const user = await message.client.users.fetch(message.channel.topic.trim())
            console.log(user);
            const msg = await message.channel.send(`\`\`\`\nTo confirm the closure of this channel send this four digit code\n\n${num}\n\nThis will cancel in 60 seconds.\n\`\`\``)
            const collector = message.channel.createMessageCollector(m => m.content.trim() == `${num}` && m.author.id == message.author.id, { time: 60000, max: 1 })
            collector.on('collect', () => {
              msg.delete().catch(e => console.log(new Error(e)))
              message.channel.send("This channel will be deleted in 15 seconds. The user that created this Mod Mail will be alerted that their case is closed.").catch(console.log)
              setTimeout(() => {
                let id = message.channel.topic
                const embed = new Discord.MessageEmbed().setTitle("ModMail: Case Closed").setDescription(`The staff of ${message.guild.name} have closed your Mod Mail case. Further messages will open a new case, but spamming this Mod Mail when your case is closed may result in punishment.`).setColor(10040319)
                if (args[0]) embed.addField("Reason", args.join(" "))
                if (message.attachments.size > 0 && isImage(message.attachments.first().name)) embed.setImage(message.attachments.first().url)
                if (MODMAIL_SERVER.reasonAlert) embed.addField("Closed By", message.author.tag)
                user.send(`Hello there,\nThe staff of ${message.guild.name} have marked your case as closed. You may still open a new one in the future.${args[0] ? `\nStaff reason: ${args.join(" ")}` : ""}`).catch(console.log)
                logMessage(message, {response: 3, staff: message.author, user: user, reason: args[0] ? args.join(" ") : false})
                message.channel.delete(`MM: ${id} closed by ${message.author.tag}`).catch(console.log)
              }, 15000)
            })
            collector.on('end', (c) => {
              if (c.size == 0) msg.edit(`\`\`\`\nClose command timed out\nThe user has not been alert and logging will continue\n\`\`\``).catch(e => console.log(new Error(e)))
            })
          }
          break;
        }
      }
    }
  })
}
