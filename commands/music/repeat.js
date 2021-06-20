const Command = require("../../structures/Command");

module.exports = class RepeatCMD extends Command {
    constructor(client) {
        super(client, {
            name: "repeat",
            memberName: "repeat",
            group: "music",
            description: "Repeat a song or queue.",
            args: [
                {
                    key: "value",
                    prompt: "do you want to repeat a song or queue?",
                    type: "string",
                    oneOf: ["song", "queue", "reset"]
                }
            ]
        })
    }


    async run(message, { value }) {
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command")
        //get the player instance
        const player = this.client.manager.players.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.")
        if (channel.id !== player.voiceChannel) return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use command`)
        switch (value) {
            case "queue":
                if (player.trackRepeat){
                    player.setTrackRepeat(false);
                } 
                if (player.queueRepeat){
                    player.setQueueRepeat(false);
                } else {
                    player.setQueueRepeat(true);
                }
                await message.say(`${player.queueRepeat ? "Enabled" : "Disabled"} loop queue.`)
                break;

            case "song":
                if (player.queueRepeat){
                    player.setQueueRepeat(false);
                }
                if (player.trackRepeat){
                    player.setTrackRepeat(false);
                } else {
                    player.setTrackRepeat(true);
                }
                await message.say(`${player.queueRepeat ? "Enabled" : "Disabled"} loop current song.`)
                break;
            case "reset":
                player.setQueueRepeat(false);
                player.setTrackRepeat(false);

                await message.say(`Disabled loop successful`);
                break;
            default:
                break;
        }
    }
}