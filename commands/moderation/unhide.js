const Commando = require("discord.js-commando");

module.exports = class UnhideCMD extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "unhide",
            memberName: "unhide",
            group: "moderation",
            description: "Unhide a specific channel",
            guildOnly: true,
            clientPermissions: ["MANAGE_CHANNELS"],
            userPermissions: ["MANAGE_CHANNELS"],
            args: [
                {
                    key: "channel",
                    label: "channel",
                    type: "channel",
                    prompt: "Please specific a channel"
                }
            ]
        });
    }
    async run(message, { channel }) {


        try {
            channel.updateOverwrite(message.guild.id, {
                "VIEW_CHANNEL": null
            }, "Hide a channel");
            message.channel.send(`Hide channel <#${channel.id}> successfully.`);
        } catch (err) {
            message.reply(`I can"t unhide channel because there is an error.`);
            this.client.logger.error(err);
        }
    }
    onBlock(message, reason, data) {
        if (reason === "clientPermissions") return message.reply(`Bot don"t have \`${data.missing}\` Permissions to run this command.`);
        else if (reason === "permission") return message.reply(`${data.response}`);
    }
};