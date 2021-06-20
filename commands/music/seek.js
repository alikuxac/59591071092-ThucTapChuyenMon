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
        if (!channel) return message.reply("you must in a voice channel to run command")
        const player = this.client.manager.players.get(message.guild.id)
        if (!player) return message.reply("there is no player for this guild.")
            
        if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.")
            
        if (Number(args.time) <= 0 || Number(args.time) >= player.queue.current.duration / 1000)
            return message.channel.send(`You may seek the duration \`1\` - \`${player.queue.current.duration}\``)
                
        player.seek(Number(args.time) * 1000);
    }
}