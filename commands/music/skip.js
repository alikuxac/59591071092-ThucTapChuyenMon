const Command = require('../../structures/Command');

module.exports = class SkipCMD extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            memberName: 'skip',
            group: 'music',
            description: 'Skip the song',
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            guildOnly: true
        })
    }
    async run(message, args) {
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command")
        //get the player instance
        const player = this.client.manager.players.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.")
        if (channel.id !== player.voiceChannel) return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use command`)
        if (player.queue.size == 0) {
            //if its on autoplay mode, then do autoplay before leaving...
            if (player.get("autoplay")) return this.client.manager.util.autoplay(this.client, player);
            //stop playing
            player.destroy();
            return message.channel.send(`⏹ Stopped and left your Channel`)
        }
        //skip the track
        player.stop();
        return message.channel.send(`⏭ Skipped to the next Song`)
    }
}