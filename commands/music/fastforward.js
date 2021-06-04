const Command = require("../../structures/Command");

module.exports = class ForwardCMD extends Command {
    constructor(client) {
        super(client, {
            name: "fastforward",
            memberName: "fastforward",
            group: "music",
            aliases: ["forward"],
            description: "Forward the song (in seconds)",
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
        if (!channel) return message.reply("you must in a voice channel to run command").then(msg => {
            try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
        });
        //get the player instance
        const player = this.client.manager.players.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.").then(msg => {
            try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
        });
        if (channel.id !== player.voiceChannel) return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use command`)
            .then(msg => {
                try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });

        let forward = player.position + number * 1000;
        //if the rewind is too big or too small set it to 0
        if (forward >= player.queue.current.duration - player.position) {
            forward = player.queue.current.duration - 1000;
        }
        player.seek(Number(forward));
        await message.say(`Forwared the song for: ${number} Seconds, to: ${this.manager.util.format(Number(player.position))}`)
    }
}