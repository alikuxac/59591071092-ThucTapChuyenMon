const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class QueueCMD extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            memberName: 'queue',
            group: 'music',
            description: 'Show queue',
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            guildOnly: true,
            args: [
                {
                    key: 'page',
                    prompt: 'Give me number',
                    type: 'integer',
                    default: 1
                }
            ]
        })
    }
    async run(message, { page }) {
        //get the player instance
        const player = this.client.manager.players.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.")
        const QueueEmbed = new MessageEmbed()
            .setAuthor(`Queue for ${message.guild.name}  -  [ ${player.queue.length} Tracks ]`, message.guild.iconURL({ dynamic: true }))
        //get the right tracks of the current tracks
        const tracks = player.queue;
        //if there are no other tracks, information

        if (tracks.current) QueueEmbed.addField("Current", `**[${tracks.current.title}](${tracks.current.uri})**`);

        const multiple = 10;
        const end = page * multiple;
        const start = end - multiple;

        let arr = tracks.slice(start, end)
        if (!tracks.length) {
            QueueEmbed.setDescription(`No song in ${page > 1 ? `page ${page}` : 'the queue'}`);
        } else {
            QueueEmbed.setDescription(arr
                .map((track, i) => `${start + ++i} - [${track.title}](${track.uri})`)
                .join("\n"))
        }
        const maxPages = Math.ceil(tracks.length / multiple);

        QueueEmbed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
        QueueEmbed.setColor("RANDOM");
        QueueEmbed.setAuthor(
            (message.member.nickname ? message.member.nickname : message.author.tag),
            message.author.displayAvatarURL({ dynamic: true })
        );
        return message.channel.send({ embed: QueueEmbed })
    }
}