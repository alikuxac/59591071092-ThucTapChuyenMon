const Command = require('../../structures/Command');

module.exports = class StopCMD extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            memberName: 'stop',
            group: 'music',
            description: 'Stop the music',
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
        //if not in the same channel as the player,
        if (channel.id !== player.voiceChannel) return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use command`)

        if (!player.queue.current) return message.reply(`No song is currently playing in this guild.`)

        //stop playing
        player.destroy();
        //send success message
        return message.channel.send(`Stopped and left your Channel`)
    }
}