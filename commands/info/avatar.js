const { commaListsAnd } = require("common-tags");
const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class AvatarCMD extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            memberName: "avatar",
            group: "info",
            description: "Show avatar of specific user",
            userPermissions: ["SEND_MESSAGES"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            aliases: ["profile-picture", "profile-pic", "pfp"],
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to see their avatar?",
                    type: "user",
                    default: message => message.author
                }
            ]
        })
    }
    run(message, { user }) {

        const format = user.avatar && user.avatar.startsWith("a_") ? "gif" : "png";
        const AvatatEmbed = new MessageEmbed()
            .setAuthor(`${user.username} (${user.id})`)
            .setImage(user.displayAvatarURL({ format, dynamic: true, size: 2048 }));

        message.channel.send({ embed: AvatatEmbed });
    }
}