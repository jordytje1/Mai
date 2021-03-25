const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'meme',
  aliases: [ 'humorme' ],
  group: 'fun',
  description: 'Generate a random meme from a select subreddit.',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'meme',
    'humorme'
  ],
  run: async (client, message) => {

    const data = await fetch(`https://meme-api.herokuapp.com/gimme`)
    .then(res => res.json())
    .catch(()=>null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Meme API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setImage(data.url)
      .setAuthor(data.title, null, data.postLink)
      .setFooter(`${data.subreddit}:Meme | \©️${new Date().getFullYear()} 𝕯𝖗𝖆𝖌𝖔𝖓𝖇𝖔𝖞#6241`)
    );
  }
};
