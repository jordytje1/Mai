module.exports = {
    config: {
        name: "new", // أسم الأمر الرئيسي..
        aliases: ['ticket'], // بإمكانك إضافة أختصارات اخرى..
        permission: 0, // مستوى البرمشنات لأستخدام الأمر, 0 = جميع الأعضاء..
        category: "tickets"
    },
    exec: async (client, msg, args, storage) => {
        const { RichEmbed } = require("discord.js");
        let [parent, support, supervisor] = [storage.tickets.category, msg.guild.roles.get(storage.tickets.roles.support), msg.guild.roles.get(storage.tickets.roles.supervisor)]
        let co = true;

        /**
         * 
         * تحقق بطريقة بسيطة جداً لجعل الأعضاء يقومون بفتح تذكرة واحدة فقط كل مرة. يجب عليهم إغلاق التذكرة المفتوحة ليتمكن من افتتاح اخرى
         * 
         */ 
        function check() {
            let channels = msg.guild.channels.filter(ch => ch.type === "text" && ch.name.startsWith("ticket-")); // نسوي فيلتر للرومات كلها 
            channels.forEach(channel => { if(channel.topic.includes(msg.author.id)) co = false; });
        }
        check(); // تحقق إذا العضو عنده تذاكر من قبل...

        if(!co) { // إذا عنده تذكرة بالفعل .. 
            let embed = new RichEmbed().addField(":x: Error 404", `You already have a ticket opened. please close it first before you create new one!`).setColor("RED");
            return msg.channel.send({embed: embed});
        }

        let ticket = await msg.guild.createChannel(`ticket-${msg.author.username}`, 'text'); // إنشاء قناة التذكرة للعضو

        let ch = msg.guild.channels.find(channel => channel.id == parent); // نحاول نجيب قسم التذاكر إذا موجود
        if(ch && ch.type === "category") ticket.setParent(ch.id); // إذا موجود وهي كاتيجوري.. ننزل التذكرة تحته
        
        ticket.setTopic(msg.author.id); // هذا مهم عشان يشوف إذا الشخص فت تذكرة من قبل او لا...

        // Overwriting channel permissions..
        ticket.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: false, VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false }); // شيل البرمشنات من الرتبة الاساسية للسيرفر
        ticket.overwritePermissions(msg.author.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true }); // نعطي العضو برمشنات للقراءة والكتابة في التذكرة
        if(support) ticket.overwritePermissions(support.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true }); // إذا فيه رتبة سبورت نعطيها برمشنات كمان
        if(supervisor) ticket.overwritePermissions(supervisor.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true, MANAGE_MESSAGES: true }); // إذا فيه رتبة مشرف نعطيه برمشنات مع إمكانية تعديل الرسائل او حذفها من التذكرة.
        let embed = new RichEmbed().setColor("BLUE").setAuthor(`Hello ${msg.author.tag}`, msg.author.displayAvatarURL).setDescription(storage.tickets.messages.welcome);
        ticket.send({embed: embed}); // نرسل رسالة الولكم في التذكرة..
        
        embed = new RichEmbed().setColor("GREEN").addField(`✅ Ticket Created`, `Successfully created your ticket <#${ticket.id}>`);
        msg.channel.send({embed: embed}); // أخيرا نرسل للعضو في الروم انه تم افتتاح التذكرة بنجاح!
    }
};

