


module.exports = {
	name: 'autorole',
	category: 'moderation',
	description: 'Feeling bored? Get some activities to do.',
	aliases: [],
	usage: 'autorole',
	run: async (client, message, args) => {

    ///////////////////////////////////////////////////////////////////////////////////////////

    func: (cmd, args, msgObj, speaker, channel, guild) => {
        var data = Util.getDataFromString(args, [
            function(str, results) {
                return Util.getRole(str, guild);
            },
        ], true);
        if (!data) return Util.commandFailed(channel, speaker, "Role not found");
        var role = data[0];
        var name = data[1].toLowerCase();
        if (Util.getPosition(speaker) <= role.position) {
            Util.commandFailed(channel, speaker, "Role has equal or higher rank");
            return;
        }
        Data.guildSet(guild, Data.autoRoles, name, role.name);
        Util.print(channel, "Added the autorole", Util.fix(name), "for the", role.name, "role");
    }
});
