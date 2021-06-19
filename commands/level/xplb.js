const Command = require("../../structures/Command");
const { MessageEmbed } = require('discord.js');
const _ = require("lodash")
const emolist = ['⏮', '◀️', '🗑️', '▶️', '⏭'];

module.exports = class XPLeaderBoard extends Command {
    constructor(client) {
        super(client, {
            name: "xplb",
            memberName: "xplb",
            description: "Show leaderboard of current guild",
            group: "level",
            guildOnly: true,
            aliases: ["xpleaderboard"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
        })
    }

    async run(message) {
        const leaderboard = await this.client.provider.LeaderBoardXP(this.client, message.guild.id);
        let chunkArr = _.chunk(leaderboard, 10);
        const embed = new MessageEmbed()
            .setTitle(`XP's Leaderboard`)
            .setDescription(chunkArr[0].map(ele => `**${ele.position}**. **${ele.username}** : Level **${ele.level}** (**${ele.xp}** xp)`).join("\n"))
        const lbMsg = await message.channel.send({ embed })
        if (leaderboard.length < 11) return;
        for (let u = 0; u < emolist.length; u++) lbMsg.react(emolist[u]);
        const filter = (reaction, user) => {
            return emolist.includes(reaction.emoji.name) && !user.bot;
        };
        const collector = listMsg.createReactionCollector(filter, { time: 300000 });
        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name) {
                case '🗑️':
                    // Delete embed and stop collect emoji
                    lbMsg.reactions.removeAll();
                    collector.stop();
                    break;
                case '▶️':
                    // Show next page
                    page = page + 1 < chunkArr.length ? ++page : 0;
                    const nexttagEmbed = new MessageEmbed(lbMsg.embed[0])
                        .setTitle(`XP's Leaderboard`)
                        .setDescription(chunkArr[page].map(ele => `**${ele.position}**. **${ele.username}** : Level **${ele.level}** (**${ele.xp}** xp)`).join("\n"))
                    lbMsg.edit({ embed: nexttagEmbed });
                    reaction.users.remove(user.id);
                    break;
                case '◀️':
                    page = page > 0 ? --page : chunkArr.length - 1;
                    const previoustagEmbed = new MessageEmbed(lbMsg.embed[0])
                        .setTitle(`XP's Leaderboard`)
                        .setDescription(chunkArr[page].map(ele => `**${ele.position}**. **${ele.username}** : Level **${ele.level}** (**${ele.xp}** xp)`).join("\n"))
                    lbMsg.edit({ embed: previoustagEmbed });
                    reaction.users.remove(user.id);
                    break;
                case '⏮':
                    page = 0
                    const firstEmbed = new MessageEmbed(lbMsg.embed[0])
                        .setTitle(`XP's Leaderboard`)
                        .setDescription(chunkArr[page].map(ele => `**${ele.position}**. **${ele.username}** : Level **${ele.level}** (**${ele.xp}** xp)`).join("\n"))
                    lbMsg.edit({ embed: firstEmbed });
                    reaction.users.remove(user.id);
                    break;
                case '⏭':
                    page = chunkArr.length - 1;
                    const lastEmbed = new MessageEmbed(lbMsg.embed[0])
                        .setTitle(`XP's Leaderboard`)
                        .setDescription(chunkArr[page].map(ele => `**${ele.position}**. **${ele.username}** : Level **${ele.level}** (**${ele.xp}** xp)`).join("\n"))
                    lbMsg.edit({ embed: lastEmbed });
                    reaction.users.remove(user.id);
                    break;
                default:
                    break;
            }
        })
        collector.on('end', () => {
            lbMsg.reactions.removeAll();
        });
    }
}