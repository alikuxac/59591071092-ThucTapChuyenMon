const Command = require("../../structures/Command");

module.exports = class RewindCMD extends Command {
    constructor(client) {
        super(client, {
            name: "rewind",
            memberName: "rewind",
            group: "music",
            description: "Rewind the song (in seconds)",
            examples: ["rewind 10"],
            args: [
                {
                    key: "number",
                    prompt: "How long do you want to rewind? (in seconds)",
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

        let rewind = player.position - number * 1000;
        //if the rewind is too big or too small set it to 0
        if (rewind >= player.queue.current.duration - player.position || rewind < 0) {
            rewind = 0;
        }
        player.seek(Number(rewind));
        await message.say(`Rewinded the song for: ${number} Seconds, to: ${this.client.manager.util.format(Number(player.position))}`)
    }
}