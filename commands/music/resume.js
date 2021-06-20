const Command = require('../../structures/Command');

module.exports = class ResumeCMD extends Command {
    constructor(client) {
        super(client, {
            name: 'resume',
            memberName: 'resume',
            group: 'music',
            description: 'Resume the music',
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

        // If player is playing
        if (player.playing) return message.channel.send(`The song is already resumed! You can pause it with: \`${this.client.commandPrefix}pause\``)
        //pause the player
        player.pause(false);

        return message.channel.send(`Success ${player.playing ? `resume` : `pause`} the Player.`)
    }
}