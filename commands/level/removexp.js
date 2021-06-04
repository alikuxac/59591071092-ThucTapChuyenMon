const Command = require("../../structures/Command");

module.exports = class RemoveXPCMD extends Command {
    constructor(client) {
        super(client, {
            name: "remove",
            memberName: "removexp",
            group: "level",
            aliases: ["rmxp"],
            description: "Add xp to specific user",
            guildOnly: true,
            userPermissions: ["ADMINISTRATOR"],
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
        let userXP = message.client.provider.getUser(user.id, "leveling");
        let serverXP = userXP["server"][guildID] ? userXP["server"][guildID] : 0;

        serverXP -= xp;
        try {
            userXP["server"][guildID] = serverXP;
            await message.client.provider.setUser(user.id, "leveling", userXP);
            return message.say(`Successully remove \`${xp}\` xp to \`${user.username}\`. User current xp: ${serverXP} `)
        } catch (err) {
            throw err;
        }
    }
}