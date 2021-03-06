const Command = require("../../structures/Command")

module.exports = class SetXPCMD extends Command {
    constructor(client) {
        super(client, {
            name: "setxp",
            memberName: "setxp",
            group: "level",
            description: "Set xp of user",
            guildOnly: true,
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            examples: ["setxp @Alikuxac 100102"],
            args: [
                {
                    key: "member",
                    prompt: "Who do you want to set?",
                    type: "member"
                },
                {
                    key: "xp",
                    prompt: "How many xp do you want to set?",
                    type: "integer"
                }
            ]
        });
    }
    async run(message, { member, xp }) {

        try {
            await message.client.provider.SetXP(member.id, message.guild.id, xp);
            message.channel.send(`Set \`${member.nickname ? member.nickname : member.user.username}\`"s xp to ${xp}`)
        } catch (err) {
            message.channel.send(`Error occured while setting user"s xp`);
            this.client.logger.log(err)
        }
    }
}