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
            examples: ["setlevel @Alikuxac 50"],
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
        
        try {
            await message.client.provider.SetLevel(member.id, message.guild.id, level);
            message.channel.send(`Set \`${member.nickname ? member.nickname : member.user.username}\`"s level to ${level}`)
        } catch (err) {
            message.channel.send(`Error occured while set user"s level`)
            this.client.logger.log(err)
        }
    }
}