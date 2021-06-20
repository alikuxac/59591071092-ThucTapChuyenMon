const Command = require('../../structures/Command');

module.exports = class SeekCMD extends Command {
    constructor(client) {
        super(client, {
            name: 'seek',
            memberName: 'seek',
            group: 'music',
            description: 'Seek a song',
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            examples: ["seek 100"],
            args: [
                {
                    key: 'time',
                    prompt: 'What time do you want to start to listen?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args) {
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command").then(msg => {
            try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
        });
        const player = this.client.manager.players.get(message.guild.id)
        if (!player) return message.reply("there is no player for this guild.")
            .then(msg => {
                try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });
        if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.")
            .then(msg => {
                try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });
        if (Number(args.time) <= 0 || Number(args.time) >= player.queue.current.duration / 1000)
            return message.channel.send(`You may seek the duration \`1\` - \`${player.queue.current.duration}\``)
                .then(msg => {
                    try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
                });
        player.seek(Number(args.time) * 1000);
    }
}