const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const message = require("../../events/message");

module.exports = class RankXP extends Command {
    constructor(client) {
        super(client, {
            name: "rank",
            memberName: "rank",
            group: "level",
            description: "Check rank of user",
            userPermissions: ["SEND_MESSAGES"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            examples: ["xp", "lvl"],
            args: [
                {
                    key: "member",
                    prompt: "Who do you want to check",
                    type: "member",
                    default: message => message.member
                }
            ]
        })
    }
    async run(message, { member }) {

        let barEmpty = "□", barFull = "■", barDisplay = "";
        let name = member.nickname ? member.nickname : member.user.username
        let xp = message.client.provider.getUser(member.id, "xp", 0);

        let currentlvl = Math.floor(Math.sqrt(xp) * 0.1);
        let current = xp < 101 ? xp : xp - Math.pow(currentlvl, 2) * 100;
        let nextlvl = currentlvl + 1;
        let total = xp < 101 ? 100 : Math.pow(nextlvl, 2) * 100 - Math.pow(currentlvl, 2) * 100;
        let percentage = Math.floor((current / total) * 100)
        percentage = Math.floor(percentage / 10)

        for (let i = 1; i < 11; i++) {
            if (percentage >= i) { barDisplay += barFull; }
            else { barDisplay += barEmpty; }
        }
        const xpArr = await message.client.provider.getDatabase().collection("Users").aggregate([{ $sort: { "settings.xp": -1 } }]).toArray();
        let found = xpArr.find(docu => docu.userID == member.id)
        let rank = xpArr.indexOf(found) + 1
        const rankEmbed = new MessageEmbed()
            .setTitle(`❯ ${name}"s Rank`)
            .setColor("RANDOM")
            .setDescription(`❯ **${current} / ${total}** XP\n❯ **Total:** ${xp}\n❯ **Rank:** ${rank}\n❯ **Level:** ${currentlvl}\n❯ **Progress bar:**\n[**${barDisplay}**](https://discord.gg/8yfv46W)`)
        message.channel.send({ embed: rankEmbed })
    }
}