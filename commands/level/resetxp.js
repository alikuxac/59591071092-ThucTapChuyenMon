const Command = require("../../structures/Command")

module.exports = class ResetXPCMD extends Command {
    constructor(client) {
        super(client, {
            name: "resetxp",
            memberName: "resetxp",
            group: "level",
            description: "Reset xp of user",
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            args: [
                {
                    key: "member",
                    prompt: "Who do you want to set?",
                    type: "member"
                }
            ]
        });
    }
    async run(message, { member }) {

        try {
            let leveling = this.client.provider.getUser(member.id, "leveling");
            let server = leveling.server;
            server[message.guild.id] = 0;
            leveling["server"] = server;
            await message.client.provider.setUser(member.id, "leveling", leveling)
            message.channel.send(`Sucessfull reset \`${member.nickname ? member.nickname : member.user.username}\`"s xp`)
        } catch (err) {
            message.channel.send(`Error occured while reset user's xp`)
            this.client.logger.log(err)
        }
    }
}