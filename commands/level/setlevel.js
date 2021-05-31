const Command = require("../../structures/Command")

module.exports = class SetLevelCMD extends Command {
    constructor(client) {
        super(client, {
            name: "setlevel",
            memberName: "setlevel",
            group: "level",
            description: "Set level of user",
            aliases: ["setlvl"],
            guildOnly: true,
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            args: [
                {
                    key: "member",
                    prompt: "Who do you want to set?",
                    type: "member"
                },
                {
                    key: "level",
                    prompt: "How many xp do you want to set?",
                    type: "integer"
                }
            ]
        });
    }
    async run(message, { member, level }) {

        let xp = Math.pow(level, 2) * 100;
        try {
            let leveling = this.client.provider.getUser(member.id, "leveling");
            let server = leveling.server;
            server[message.guild.id] = xp;
            leveling["server"] = server;
            await message.client.provider.setUser(member.id, "leveling", leveling);
            message.channel.send(`Set \`${member.nickname ? member.nickname : member.user.username}\`"s level to ${level}`)
        } catch (err) {
            message.channel.send(`Error occured while set user"s level`)
            this.client.logger.log(err)
        }
    }
}