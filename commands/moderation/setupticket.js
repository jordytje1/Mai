const Discord = require("discord.js");

module.exports = {
    info: {
        name: "setup",
        category: "ticket",
        permission: "founder",
    },
    execute: async (msg, { config, mongoose }) => {
        // TODO: Proper emoji configuration which saves in the database - i was too lazy.
        let guildId = msg.guild.id;
        let emoji = msg.guild.emojis.cache.find(
            (emoji) => emoji.id === config.tickets.emoji
        );

        const ticketEmbed = new Discord.MessageEmbed()
            .setTitle("Server Support")
            .setDescription(
                `React with the <:${emoji.name}:${emoji.id}> to create a ticket!`
            )
            .setColor("#3498db")
            .setFooter(
                "Your ticket will be located at the top of discord.",
                "https://cdn.discordapp.com/avatars/771824383429050379/4c48fcc72ea0640c9a1b8709770f41bc.png"
            );
        let ticketMessage = await msg.channel.send(ticketEmbed);
        ticketMessage.react(emoji);

        await mongoose.updateTicketGuildMessage(guildId, ticketMessage.id);
    },
};
