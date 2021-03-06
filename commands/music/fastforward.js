const Command = require("../../structures/Command");

module.exports = class ForwardCMD extends Command {
    constructor(client) {
        super(client, {
            name: "fastforward",
            memberName: "fastforward",
            group: "music",
            aliases: ["forward"],
            description: "Forward the song (in seconds)",
            examples: ["fastforward 50"],
            args: [
                {
                    key: "number",
                    prompt: "How long do you want to forward? (in seconds)",
                    type: "integer",
                    min: 0
                }
            ]
        })
    }

    async run(message, { number }) {
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command")
        //get the player instance
        const player = this.client.manager.players.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.")
        if (channel.id !== player.voiceChannel) return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use command`)

        let forward = player.position + number * 1000;
        //if the rewind is too big or too small set it to 0
        if (forward >= player.queue.current.duration - player.position) {
            forward = player.queue.current.duration - 1000;
        }
        player.seek(Number(forward));
        await message.say(`Forwared the song for: ${number} Seconds, to: ${this.client.manager.util.format(Number(player.position))}`)
    }
}