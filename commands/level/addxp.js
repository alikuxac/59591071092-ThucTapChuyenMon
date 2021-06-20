const Command = require("../../structures/Command");

module.exports = class AddXPCMD extends Command {
    constructor(client) {
        super(client, {
            name: "addxp",
            memberName: "addxp",
            group: "level",
            description: "Add xp to specific user",
            guildOnly: true,
            userPermissions: ["MANAGE_ROLES"],
            examples: ["addxp @Alikuxac 100"],
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to add?",
                    type: "user"
                },
                {
                    key: "xp",
                    prompt: "Give me number of xp want to add",
                    type: "integer"
                }
            ]
        })
    }

    async run(message, { user, xp }) {
        const guildID = message.guild.id;

        try {
            await message.client.provider.AppendXP(user.id, guildID, xp);
            let xpafter = await this.client.provider.GetXP(user.id, message.guild.id);
            return message.say(`Successully add \`${xp}\` xp to \`${user.username}\`. User current xp: ${xpafter} `)
        } catch (err) {
            throw err;
        }
    }
}