const Command = require("../../structures/Command");
const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = class QRCodeCMD extends Command {
    constructor(client) {
        super(client, {
            name: "qrcode",
            memberName: "qrcode",
            group: "other",
            description: "Create qrcode based on input",
            userPermissions: ["SEND_MESSAGES"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            args: [
                {
                    key: "input",
                    prompt: "What do you want to share?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, { input }) {
        let link = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(input)}&size=200x200`
        const attachment = new MessageAttachment(link, "qrcode.png");
        const embed = new MessageEmbed()
            .setTitle("QRCode Generated!")
            .attachFiles(attachment)
            .setColor("BLUE")
            .setImage("attachment://qrcode.png")
            .setFooter(`Created by ${message.author.username}`, message.author.displayAvatarURL());
        message.channel.send({ embed: embed });
    }
}