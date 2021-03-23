module.exports = {
    name: 'reactionrole',
    description: "send the reactionrole message!",
   run: async (message, args, Discord, client) => {
        const channel = '823589778216714321';
        let usRole = message.guild.roles.cache.find(role => role.name === "test")


        const usEmoji = '✅';

        let embed = new Discord.MessageEmbed()
        .setColor('#17b111')
        .setTitle('React to the corresponding emojis to get personalized notifications!')
        .setDescription('Once reacting you will gain your roles!\n\n'
            + `${usEmoji} US\n`);


        let messageEmbed = await message.channel.send(embed);
        console.log("Reactionrole Message Created")
        messageEmbed.react(usEmoji);


        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
        
            if(reaction.message.channel.id == channel) {
                if (reaction.emoji.name === usEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(usRole);
                }
                }
            }
        );

        client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
        
            if(reaction.message.channel.id == channel) {
                if (reaction.emoji.name === usEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(usRole);
                }
                }
            }
        );
    }
}
