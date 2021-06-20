const Commando = require("discord.js-commando");

module.exports = class KickCMD extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "kick",
            memberName: "kick",
            group: "moderation",
            guildOnly: true,
            description: "Kick a member from a server.",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
            examples: ["kick @Alikuxac spam"],
            args: [
                {
                    key: "member",
                    prompt: "Please specific a member.",
                    type: "member"
                },
                {
                    key: "reason",
                    prompt: "The reason to kick",
                    type: "string",
                    default: "None",
                    validate: reason => {
                        if (reason.length > 1000) return "Reason must be below 1000 characters.";
                    }
                }
            ]
        });
    }
    async run(msg, { member, reason }) {

        if (!member.id === msg.guild.ownerID) return msg.reply("You can\"t ban god of the server.");

        reason = member.user.tag + " | " + reason;
        let bot = msg.guild.me;
        let bothighest = bot.roles.highest;
        let memhighest = member.roles.highest;

        if (bothighest >= memhighest) return msg.reply("You can\"t kick user that have role higher or equal bot role.");
        member.kick(reason)
            .catch(this.client.logger.error);
        msg.channel.send(`Kicked ${member.user.username} successfully`);
    }

};