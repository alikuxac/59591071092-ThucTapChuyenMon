const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const emolist = ['◀️', '🗑️', '▶️'];

module.exports = class InroleCMD extends Command {
    constructor(client) {
        super(client, {
            name: "inrole",
            memberName: "inrole",
            group: "other",
            description: "Show user list that have specific role",
            guildOnly: true,
            args: [
                {
                    key: "role",
                    prompt: "Give me the role name",
                    type: "role"
                }
            ]
        })
    }

    async run(message, { role }) {
        const roleArr = role.members.size !== 0 ? role.members.array().map(member => `<@${member.id}>`) : "None";
        const chunkArr = _.chunk(roleArr, 10);
        let page = 0, page_total = chunkArr.length - 1;
        const embed = new MessageEmbed()
            .setColor('#ABCDEF')
            .setAuthor(`${role.name} (Count: ${role.members.size})`)
            .setDescription(chunkArr[0].join("\n"))
            .setFooter(`${page}/${page_total}`)
        const listMsg = await message.channel.send({ embed })
        if (role.members.size < 11) return;
        for (let u = 0; u < emolist.length; u++) listMsg.react(emolist[u]);
        const filter = (reaction, user) => {
            return emolist.includes(reaction.emoji.name) && !user.bot;
        };
        const collector = listMsg.createReactionCollector(filter, { time: 30000 });
        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name) {
                case '🗑️':
                    // Delete embed and stop collect emoji
                    listMsg.reactions.removeAll();
                    collector.stop();
                    break;
                case '▶️':
                    // Show next page
                    page = page + 1 < chunkArr.length ? ++page : 0;
                    const nexttagEmbed = new MessageEmbed(listMsg.embed[0])
                        .setColor('#ABCDEF')
                        .setAuthor(`${role.name} (Count: ${role.members.size})`)
                        .setDescription(chunkArr[page].join("\n"))
                        .setFooter(`${page}/${page_total}`)
                    listMsg.edit({ embed: nexttagEmbed });
                    reaction.users.remove(user.id);
                    break;
                case '◀️':
                    page = page > 0 ? --page : chunkArr.length - 1;
                    const previoustagEmbed = new MessageEmbed(listMsg.embed[0])
                        .setColor('#ABCDEF')
                        .setAuthor(`${role.name} (Count: ${role.members.size})`)
                        .setDescription(chunkArr[page].join("\n"))
                        .setFooter(`${page}/${page_total}`)
                    listMsg.edit({ embed: previoustagEmbed });
                    reaction.users.remove(user.id);
                    break;
                default:
                    break;
            }
        })
        collector.on('end', () => {
            listMsg.reactions.removeAll();
        });

    }
}