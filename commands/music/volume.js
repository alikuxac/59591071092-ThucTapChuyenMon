const Command = require('../../structures/Command');

module.exports = class VolumeCMD extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            memberName: 'volume',
            group: 'music',
            description: 'Set volume of current player',
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            examples: ["volume 15"],
            args: [
                {
                    key: 'volume',
                    prompt: 'What volume do you want to set?',
                    type: 'string',
                    default: ''
                }
            ]
        })
    }
    async run(message, args) {
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command")
        const player = this.client.manager.players.get(message.guild.id)

        if (!player) return message.reply("there is no player for this guild.")

        if (!args.volume) return message.reply(`the player volume is \`${player.volume}\`%.`)

        if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.")

        const volume = Number(args.volume);
        if (!volume || volume < 1 || volume > 200) return message.reply("you need to give me a volume between 1 and 200.")

        player.setVolume(volume);
        return message.reply(`set the player volume to \`${volume}\`%.`)
    }
}