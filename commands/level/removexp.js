const Command = require("../../structures/Command");

module.exports = class RemoveXPCMD extends Command {
    constructor(client) {
        super(client, {
            name: "removexp",
            memberName: "removexp",
            group: "level",
            aliases: ["rmxp"],
            description: "Add xp to specific user",
            guildOnly: true,
            userPermissions: ["MANAGE_ROLES"],
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to add?",
                    type: "user"
                },
                {
                    key: "xp",
                    prompt: "Give me number of xp want to remove",
                    type: "integer"
                }
            ]
        })
    }

    async run(message, { user, xp }) {
        const guildID = message.guild.id;

        try {
             await message.client.provider.SpliceXP(user.id, guildID, xp);
             let xpafter = await this.client.provider.GetXP(user.id, message.guild.id);
            return message.say(`Successully add \`${xp}\` xp to \`${user.username}\`. User current xp: ${xpafter} `)
        } catch (err) {
            throw err;
        }
    }
}