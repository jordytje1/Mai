const { MessageEmbed, Collection } = require('discord.js')
const fetch = require('node-fetch')
const { commatize } = require('../../helper.js')

module.exports.run = async (client, message, args) => {

if (!client.memes.get(message.guild.id)){
  client.memes.set(message.guild.id, new Collection())
}

const memes = client.memes.get(message.guild.id)

if (!memes.size) await reloadMeme(memes, message)

if (args[0] === 'reload') {

  await reloadMeme(memes, message)
  if (!memes.size) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('Could not fetch memes from reddit! Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))
  const data = memes.first()
  memes.delete(data.title)
  return message.channel.send(embedMeme(data))

} else {

  const data = memes.first()
  memes.delete(data.title)
  if (!memes.size) await reloadMeme(memes, message)
  return message.channel.send(embedMeme(data))

}

}

module.exports.config = {
  name: 'animeme',
  aliases: ['ameme','animememe','animemes','animememes','amemes'],
  cooldown: {
    time: 0,
    msg: ""
  },
	group: 'anime',
  guildOnly: true,
	description: 'Generate a random anime meme fetched from selected subreddits. Include [reload] parameter to reload meme cache.',
	examples: ['animeme [reload]','ameme','animememe'],
	parameters: []
}


async function reloadMeme(memes,message){

  if (memes.size){
    memes.clear()
  }

  const data = await fetch(`https://www.reddit.com/r/animemes.json`).then(res => res.json()).catch(()=>{})

  if (!data) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('Could not fetch memes from reddit! Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))

  const { data : { children } } = data

  const info = []

  children.filter( m => m.data.post_hint === 'image').forEach( post => info.push({title:post.data.title,up:post.data.ups,downs:post.data.downs,link:`https://www.reddit.com${post.data.permalink}`,image:post.data.url,timestamp:post.data.created_utc * 1000}))

  info.forEach( meme => memes.set(meme.title,meme) )

}

function embedMeme(reddit){

  const meme = new MessageEmbed()
      .setFooter(`${commatize(reddit.up)}👍 | ${commatize(reddit.downs)}👎 || Animeme`)
      .setColor('GREY')
      .setTitle(reddit.title)
      .setURL(reddit.link)
      .setImage(reddit.image)
      .setTimestamp(reddit.timestamp)

  return meme

}
