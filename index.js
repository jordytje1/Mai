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
                             

//client.on("channelDelete", (channel) => {
  //  if (channel.parentID == channel.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
    //    const person = channel.guild.members.cache.find((x) => x.id == channel.name)
//
     //   if (!person) return;

     //   let yembed = new discord.MessageEmbed()
        //    .setAuthor("MAIL DELETED", client.user.displayAvatarURL())
         //   .setColor('RED')
        //    .setThumbnail(client.user.displayAvatarURL())
          //  .setDescription("Your mail is deleted by moderator and if you have any problem with that than you can open mail again by sending message here.")
      //  return person.send(yembed)

  //  }


//})


//client.on("message", async message => {
    //if (message.author.bot) return;

   //const args = message.content.slice(prefix.length).trim().split(/ +/g);
   // let command = args.shift().toLowerCase();


  //  if (message.guild) {

      //  if (command == "setup") {
          //  if (!message.content.startsWith(prefix)) return;
         //   if (!message.member.hasPermission("ADMINISTRATOR")) {
            //    return message.channel.send("You need Admin Permissions to setup the modmail system!")
         //   }

          //  if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
            //    return message.channel.send("Bot need Admin Permissions to setup the modmail system!")
          //  }


          //  let role = message.guild.roles.cache.find((x) => x.name == "Staff")
         //   let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

          //  if (!role) {
               // role = await message.guild.roles.create({
                  //  data: {
                    //    name: "Staff",
                     //   color: "GREEN"
                   // },
                  //  reason: "Role needed for ModMail System"
               // })
          //  }

           // await message.guild.channels.create("MODMAIL", {
            //    type: "category",
            //    topic: "All the mail will be here",
             //   permissionOverwrites: [
            //        {
                      //  id: role.id,
                    //    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                   // },
                  //  {
                     //   id: everyone.id,
                     //   deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  //  }
              //  ]
          //  })


          //  return message.channel.send("Setup is Completed ✅")

      //  } else if (command == "close") {
       //     if (!message.content.startsWith(prefix)) return;
       //     if (!message.member.roles.cache.find((x) => x.name == "Staff")) {
        //        return message.channel.send("You need `Staff` role to use this command")
        //    }
        //    if (message.channel.parentID == message.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {

         //       const person = message.guild.members.cache.get(message.channel.name)
//
           //     if (!person) {
              //      return message.channel.send("I am Unable to close the channel and this error is coming because probaly channel name is changed.")
            //    }

             //   await message.channel.delete()

              //  let yembed = new discord.MessageEmbed()
                //    .setAuthor("MAIL CLOSED", client.user.displayAvatarURL())
                //    .setColor("RED")
                  //  .setThumbnail(client.user.displayAvatarURL())
                  //  .setFooter("Mail is closed by " + message.author.username)
              //  if (args[0]) yembed.setDescription(`Reason: ${args.join(" ")}`)

               // return person.send(yembed)

         //   }
      //  } else if (command == "open") {
         //   if (!message.content.startsWith(prefix)) return;
        //    const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")

           // if (!category) {
           //     return message.channel.send("Moderation system is not setuped in this server, use " + prefix + "setup")
           // }

          //  if (!message.member.roles.cache.find((x) => x.name == "Staff")) {
             //   return message.channel.send("You need `Staff` role to use this command")
         //   }
//
         //   if (isNaN(args[0]) || !args.length) {
            //    return message.channel.send("Please Give the ID of the person")
           // }

          //  const target = message.guild.members.cache.find((x) => x.id === args[0])

          //  if (!target) {
            //    return message.channel.send("Unable to find this person.")
         //   }
//

           // const channel = await message.guild.channels.create(target.id, {
           //     type: "text",
            //    parent: category.id,
            //    topic: "Mail is Direct Opened by **" + message.author.username + "** to make contact with " + message.author.tag
           // })

           // let nembed = new discord.MessageEmbed()
             //   .setAuthor("DETAILS", target.user.displayAvatarURL({ dynamic: true }))
             //   .setColor("BLUE")
               // .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
               // .setDescription(message.content)
               // .addField("Name", target.user.username)
               // .addField("Account Creation Date", target.user.createdAt)
               // .addField("Direct Contact", "Yes(it means this mail is opened by a Staff)");

          //  channel.send(nembed)

           // let uembed = new discord.MessageEmbed()
             //   .setAuthor("DIRECT MAIL OPENED")
              //  .setColor("GREEN")
              //  .setThumbnail(client.user.displayAvatarURL())
               // .setDescription("You have been contacted by Staff of **" + message.guild.name + "**, Please wait until he send another message to you!");


           // target.send(uembed);

           // let newEmbed = new discord.MessageEmbed()
              //  .setDescription("Opened The Mail: <#" + channel + ">")
              //  .setColor("GREEN");

           // return message.channel.send(newEmbed);
      //  } else if (command == "help") {
         //   if (!message.content.startsWith(prefix)) return;
          //  let embed = new discord.MessageEmbed()
             //   .setAuthor('MODMAIL BOT', client.user.displayAvatarURL())
              //  .setURL('https://flamebot.gq')
             //   .setColor("#FF0000")

              //  .setDescription("This bot is made by FiredragonPlayz") //Please Don't Remove Credits
              //  .addField("$setup", "Setup the modmail system(This is not for multiple server.)", true)
//
               // .addField("$open", 'Let you open the mail to contact anyone with his ID', true)
               // .setThumbnail(client.user.displayAvatarURL())
               // .addField("$close", "Close the mail in which you use this command.", true);

           // return message.channel.send(embed)

       // }
   // }







  //  if (message.channel.parentID) {

     //   const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")

     //   if (message.channel.parentID == category.id) {
        //    let member = message.guild.members.cache.get(message.channel.name)
//
         //   if (!member) return message.channel.send('Unable To Send Message')

          //  let lembed = new discord.MessageEmbed()
              //  .setColor("GREEN")
             //   .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
              //  .setDescription(message.content)

       //     return member.send(lembed)
     //   }
//
      

  //  }

  //  if (!message.guild) {
     //   const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => { })
    //    if (!guild) return;
     //   const category = guild.channels.cache.find((x) => x.name == "MODMAIL")
      //  if (!category) return;
      //  const main = guild.channels.cache.find((x) => x.name == message.author.id)


       // if (!main) {
          //  let mx = await guild.channels.create(message.author.id, {
             //   type: "text",
              //  parent: category.id,
               // topic: "This mail is created for helping  **" + message.author.tag + " **"
           // })

            //let sembed = new discord.MessageEmbed()
               // .setAuthor("MAIL OPENED")
               // .setColor("GREEN")
               // .setThumbnail(client.user.displayAvatarURL())
              // .setDescription("Conversation is now started, you will be contacted by staff soon")

          //  message.author.send(sembed)


           // let eembed = new discord.MessageEmbed()
               // .setAuthor("DETAILS", message.author.displayAvatarURL({ dynamic: true }))
               // .setColor("BLUE")
               // .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
               // .setDescription(message.content)
               // .addField("Name", message.author.username)
               // .addField("Id", message.author.id)
              //  .addField("Account Creation Date", message.author.createdAt)
              //  .addField("Direct Contact", "No(it means this mail is opened by person not a staff)")


          //  return mx.send(eembed)
       // }

        //let xembed = new discord.MessageEmbed()
         //   .setColor("RED")
        //    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
         //   .setDescription(message.content)


      //  main.send(xembed)

   // }




//})




const conflig = require('./conflig.json');

const Discord = require('discord.js');
const cllient = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


cllient.on('messageReactionAdd', async (reaction, user) => {
    
    let serverData;

    conflig.reactions.forEach((el)=>{
        if (el.messageId == reaction.message.id && el.emojiId == reaction.emoji.id) {
            serverData = el;
        }
    });

    if (serverData == undefined) return;
    
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    reaction.message.guild.members.fetch(user)
        .then((member) => 
        {
            member.roles.add(serverData.roleId);
        });
});

cllient.on('messageReactionRemove', async (reaction, user) => {
    
    let serverData;

    conflig.reactions.forEach((el)=>{
        if (el.messageId == reaction.message.id && el.emojiId == reaction.emoji.id) {
            serverData = el;
        }
    });

    if (serverData == undefined) return;
    
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    reaction.message.guild.members.fetch(user)
        .then((member) => 
        {
            member.roles.remove(serverData.roleId);
        });
});

const cient = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const conftig = {
    "prefix": "!",
   
   
    "apply_channel_id": "823169018042122260",
    "finished_applies_channel_id": "823169018042122260",
    
    
    "QUESTIONS": [
        "Question 1",
        "Question 2",
        "Question 3",
        "Question 4",
        "Question 5",
        "Question 6",
        "Question 7",
        "Question 8",
        "Question 9"
    ]
}

client.on("ready", () => {
    console.log("BOT IS READY" + client.user.tag)
    cient.user.setActivity("APPLY NOW IN | APPLY HERE", {type: "WATCHING"})
})

client.on("message", (message)=>{
    if(message.author.bot || !message.guild) return;
    if(!message.content.startsWith(conftig.prefix)) return;
    let args = message.content.slice(conftig.prefix.length).split(" ");
    let cmd = args.shift();

    if(cmd === "embed"){
        console.log(args)
        let newargs = args.join(" ").split("+")
        console.log(newargs)
        message.channel.send(
            new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(newargs[0] ? newargs[0] : "")
            .setDescription(newargs.slice(1).join(" ") ? newargs.slice(1).join(" ") : "")
            .setFooter("React with the granted emoji!")
        )
    }
    else if (cmd === "react"){
        message.channel.messages.fetch(args[0]).then(msg => message.react(args[1]));
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    const { message } = reaction;
    if(user.bot || !message.guild) return;
    if(message.partial) await message.fetch();
    if(reaction.partial) await reaction.fetch();
    
    if(message.guild.id === "734869150240866484" && message.channel.id === conftig.apply_channel_id && (reaction.emoji.name === "✅" || reaction.emoji.id === "653206656179503104")){
        let guild = await message.guild.fetch();
        let channel_tosend = guild.channels.cache.get(conftig.finished_applies_channel_id);
        if(!channel_tosend) return console.log("RETURN FROM !CHANNEL_TOSEND");
        const answers = [];
        let counter = 0;

        ask_question(conftig.QUESTIONS[counter]);

        function ask_question(qu){
            if(counter === conftig.QUESTIONS.length) return send_finished();
            user.send(qu).then(msg => {
                msg.channel.awaitMessages(m=>m.author.id === user.id, {max: 1, time: 60000, errors: ["time"]}).then(collected => {
                    answers.push(collected.first().content);
                    ask_question(conftig.QUESTIONS[++counter]);
                })
            })
        }
        function send_finished(){
            let embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("A new application from: " + user.tag) //Tomato#6966
            .setDescription(`${user}  |  ${new Date()}`)
            .setFooter(user.id, user.displayAvatarURL({dynamic:true}))
            .setTimestamp()
            for(let i = 0; i < conftig.QUESTIONS.length; i++){
                try{
                    embed.addField(conftig.QUESTIONS[i], String(answers[i]).substr(0, 1024))
                }catch{
                }
            }
            channel_tosend.send(embed);
            user.send("Thanks for applying to: " + message.guild.name)
        }
        

    }

})










let lol = "824728580235198515";
let loll = "824728606843338752";
let lolll = "824728649831153705";
let lollll = "824728690470158416";
let lolo = "824728754986418266";
let lollllll = "824728794605813780";
let lolllllll = "824728835366977626";
let lollllllll = "824728878999535616";
let lolllllllll = "824728918417473627";

let vrouw = "824728424450097182";
let man = "824728384239960115";
let geen = "824728489629974628";

let dmopen = "824729186274508871";
let dmclosed = "824728975002697759";


let kat = "824729291186765834";
let hond = "824729340356984922";
let paard = "824729604899471411";
let knaagdier = "824729421280837693";
let reptiel = "824729481632809041";
let overig = "824729712193568849";

let cargoMembro = "";

let idMsg = "824726524988620821";

let idGuild = "822221981604642846";

client.on("raw", async e => {
  if (e.t == "MESSAGE_REACTION_ADD") {
    let member = client.guilds.cache.get(e.d.guild_id).members.cache.get(e.d.user_id);
    if (e.d.message_id == idMsg) {
      switch (e.d.emoji.name) {
        case "1️⃣": {
          member.roles.add(lol);
          member.roles.add(lol);
          break;
        }
        case "2️⃣": {
          member.roles.add(loll);
          member.roles.add(loll);
          break;
        }
        case "3️⃣": {
          member.roles.add(lolll);
          member.roles.add(lolll);
          break;
        }
          case "4️⃣": {
          member.roles.add(lollll);
          member.roles.add(lollll);
          break;
        }
        case "5️⃣": {
          member.roles.add(lolo);
          member.roles.add(lolo);
          break;
        }
        case "6️⃣": {
          member.roles.add(lollllll);
          member.roles.add(lollllll);
          break;
        }
          case "7️⃣": {
          member.roles.add(lolllllll);
          member.roles.add(lolllllll);
          break;
        }
        case "8️⃣": {
          member.roles.add(lollllllll);
          member.roles.add(lollllllll);
          break;
        }
        case "9️⃣": {
          member.roles.add(lolllllllll);
          member.roles.add(lolllllllll);
          break;
        }
      }
    } else if (e.d.message_id == "824727012395450408") {
      let member = client.guilds.cache.get(e.d.guild_id).members.cache.get(e.d.user_id);
      switch (e.d.emoji.name) {
        case "✅": {
          member.roles.add(dmopen);
          break;
        }
        case "❎": {
          member.roles.add(dmclosed);
          break;
        }
      }
    } else if (e.d.message_id == "824724871979991060") {
      let member = client.guilds.cache.get(e.d.guild_id).members.cache.get(e.d.user_id);
      console.log(e.d.emoji.name);
      switch (e.d.emoji.name) {
        case "🙋‍♀️": {
          member.roles.add(vrouw);
          break;
        }
        case "🙋‍♂️": {
          member.roles.add(man);
          break;
        }
        case "❌": {
          member.roles.add(geen);
          break;
                  }
      }
    } else if (e.d.message_id == "824728239293464606") {
      let member = client.guilds.cache.get(e.d.guild_id).members.cache.get(e.d.user_id);
      console.log(e.d.emoji.name);
      switch (e.d.emoji.name) {
        case "🐱": {
          member.roles.add(kat);
          break;
        }
        case "🐶": {
          member.roles.add(hond);
          break;
        }
        case "🐴": {
          member.roles.add(paard);
          break;
          }
        case "🐹": {
          member.roles.add(knaagdier);
          break;
          }
        case "🦎": {
          member.roles.add(reptiel);
          break;
          }
        case "🌐": {
          member.roles.add(overig);
          break;
        }
      }
    }
  }
});


client.on("raw", async e => {
  if (e.t == "MESSAGE_REACTION_REMOVE") {
    let member = client.guilds.cache.get(e.d.guild_id).members.cache.get(e.d.user_id);
    if (e.d.message_id == idMsg) {
      switch (e.d.emoji.name) {
        case "1️⃣": {
          member.roles.remove(lol);
          member.roles.remove(lol);
          break;
        }
        case "2️⃣": {
          member.roles.remove(loll);
          member.roles.remove(loll);
          break;
        }
        case "3️⃣": {
          member.roles.remove(lolll);
          member.roles.remove(lolll);
          break;
        }
          case "4️⃣": {
          member.roles.remove(lollll);
          member.roles.remove(lollll);
          break;
        }
        case "5️⃣": {
          member.roles.remove(lolo);
          member.roles.remove(lolo);
          break;
        }
        case "6️⃣": {
          member.roles.remove(lollllll);
          member.roles.remove(lollllll);
          break;
        }
          case "7️⃣": {
          member.roles.remove(lolllllll);
          member.roles.remove(lolllllll);
          break;
        }
        case "8️⃣": {
          member.roles.remove(lollllllll);
          member.roles.remove(lollllllll);
          break;
        }
        case "9️⃣": {
          member.roles.remove(lolllllllll);
          member.roles.remove(lolllllllll);
          break;
        }
      }
    } else if (e.d.message_id == "824727012395450408") {
      let member = client.guilds.cache.get(e.d.guild_id).members.cache.get(e.d.user_id);
      switch (e.d.emoji.name) {
        case "✅": {
          member.roles.remove(dmopen);
          break;
        }
        case "❎": {
          member.roles.remove(dmclosed);
          break;
        }
      }
    } else if (e.d.message_id == "824724871979991060") {
      let member = client.guilds.cache.get(e.d.guild_id).members.cache.get(e.d.user_id);
      console.log(e.d.emoji.name);
      switch (e.d.emoji.name) {
        case "🙋‍♀️": {
          member.roles.remove(vrouw);
          break;
        }
        case "🙋‍♂️": {
          member.roles.remove(man);
          break;
        }
        case "❌": {
          member.roles.remove(geen);
          break;
                  }
      }
    } else if (e.d.message_id == "824728239293464606") {
      let member = client.guilds.cache.get(e.d.guild_id).members.cache.get(e.d.user_id);
      console.log(e.d.emoji.name);
      switch (e.d.emoji.name) {
        case "🐱": {
          member.roles.remove(kat);
          break;
        }
        case "🐶": {
          member.roles.remove(hond);
          break;
        }
        case "🐴": {
          member.roles.remove(paard);
          break;
          }
        case "🐹": {
          member.roles.remove(knaagdier);
          break;
          }
        case "🦎": {
          member.roles.remove(reptiel);
          break;
          }
        case "🌐": {
          member.roles.remove(overig);
          break;
        }
      }
    }
  }
});




client.on("guildMemberAdd", member => {
  return att();
});

client.on("guildMemberRemove", member => {
  return att();
});

async function att(){
  let info = 0;
  let adm = 0;
  let vest = 0;
  let bots = 0;

  client.guilds.cache.get(idGuild).members.cache.map(m => {
    if (m.user.bot) {
      bots++;
    }
  });
  
  client.guilds.cache.get(idGuild).members.cache.map(m => {
  if(m.user.bot) return;
    if (m.roles.cache.has(cargoInfo)) {
      info++;
    } else if (m.roles.cache.has(cargoAdm)) {
      adm++;
    } else if (m.roles.cache.has(cargoVest)) {
      vest++;
    }
  });
  
  bots += 1;
  
  let usu = (client.guilds.cache.get(idGuild).memberCount - bots);

  client.guilds.cache
    .get(idGuild)
    .channels.cache.get("823169085231726602")
    .setName("👤| Usuários: " + usu);
  client.guilds.cache
    .get(idGuild)
    .channels.cache.get("823169085231726602")
    .setName("💻| Info: " + info);
  client.guilds.cache
    .get(idGuild)
    .channels.cache.get("823169085231726602")
    .setName("📊| Adm: " + adm);
  client.guilds.cache
    .get(idGuild)
    .channels.cache.get("823169085231726602")
    .setName("👚| Vest: " + vest);
}













client.login();
