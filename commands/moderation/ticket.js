const Discord = require("discord.js");
const color = require('../colors.json');
module.exports.run = async (bot, message, args) => {
    let tickets = message.guild.channels.cache.find(c => c.name == "tickets" && c.type == "text");
    if(!tickets){
      message.channel.send("The ticket channel is missing, please provide a 'Tickets' channel.");
    }else{
      let msg = await message.channel.send("Robots are handling your request...");
    let ticketembed = new Discord.MessageEmbed()
    .setColor(color.geel)
    .setTitle("Ticket creation")
    .addField('Hi there!', 'In order to get support, react with the following emoji :tickets:.', true)
    .setTimestamp()
    .setFooter("Ticket System", bot.user.displayAvatarURL());
    tickets.send({embed: ticketembed}).then(ticketembed => {ticketembed.react("🎟️");this.messageId = message.id;});
    message.channel.send("Your ticket panel has been created at #tickets .");
    msg.delete();
  }
    bot.on("messageReactionAdd", async(reaction, user) => {
      if(user.bot) return;
        if(reaction.emoji.name === "🎟️"){
          let tickets = message.guild.channels.cache.find(c => c.name == "Tickets" && c.type == "text");
          let category = message.guild.channels.cache.find(c => c.name == "Open-Tickets" && c.type == "category");
          if(!category){
          message.guild.channels.create('Open-Tickets', {
          type: 'category',
          permissionsOverwrites: [{
            id: message.guild.id,
            deny: ['MANAGE_MESSAGES'],
            allow: ['SEND_MESSAGES']
          }]
        }).then(console.log("Category created"));
      }else{
          let name = `ticket-numberherelater`;
            message.guild.channels.create(name, {
            type: "text",
            topic: `Thank you for contacting support ${user.username}`,
            permissionOverwrites: [{
           id: message.guild.id,
           deny: ['VIEW_CHANNEL'],
         },
         {
           id: user.id,
           allow: ['VIEW_CHANNEL'],
         }
       ]
     }).then(
            (chan) => {
              console.log("Channel creation");
              channel = message.guild.channels.cache.find(c => c.name == "ticket-numberherelater" && c.type == "text");
              if (category && channel) channel.setParent(category.id);
              else console.error(`One of the channels is missing:\nCategory: ${!!category}\nChannel: ${!!channel}`);
              let ticketCreationEmbed = new Discord.MessageEmbed()
              .setColor(color.blue)
              .setTitle("Hi there!")
              .addField('Please choose a category in order to get the correct help.','\u200B')
              .addField("💥 = Crash  👨‍💻 = Server problem  💿 = Others", '\u200B')
              .setFooter("Ticket System", bot.user.displayAvatarURL());
              chan.send({embed: ticketCreationEmbed}).then(ticketCreationEmbed => {ticketCreationEmbed.react("💥").then(() => ticketCreationEmbed.react('👨‍💻')).then(() => ticketCreationEmbed.react('💿'));});
              if(reaction.emoji.name === "💥"){
                message.channel.send("It's a crash! :o");
              }else if(reaction.emoji.name === "‍👨‍💻‍"){
                message.channel.send("It's a server problem! :o");
              }else if(reaction.emoji.name === "‍💿‍"){
                message.channel.send("It's an other problem! :o");
              }
          });
}
        }
    });
};

exports.help = {
  name: 'ticket',
  description: 'Create a support-ticket.',
  usage: 'ticket'
};
