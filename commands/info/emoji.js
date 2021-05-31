const Command = require("../../structures/Command");

module.exports = class EmojiCMD extends Command {
    constructor(client) {
        super(client, {
            name: "emoji",
            memberName: "emoji",
            group: "info",
            description: "Show basic information of the emoji",
            userPermissions: ["SEND_MESSAGES"],
            clientPermissions: ["SEND_MESSAGES"],
            guildOnly: true,
            args: [
                {
                    key: "emoji",
                    type: "custom-emoji",
                    prompt: "Please specific a custom emoji."
                }
            ]
        });
    }
    run(msg, { emoji }) {


        let animated = emoji.animated ? "gif" : "png";
        let name = emoji.name.toString();
        let id = emoji.id;
        msg.channel.send(`Name: ${name}\nID: ${id}\nLink: https://cdn.discordapp.com/emojis/${id}.${animated}?v=1`);
    }
};