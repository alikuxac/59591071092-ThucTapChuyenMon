const Command = require('../../structures/Command');
const { autoplay } = require('../../handlers/music/MusicFunction');

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
        if (player.queue.size == 0) {
            //if its on autoplay mode, then do autoplay before leaving...
            if (player.get("autoplay")) return autoplay(client, player, "skip");
            //stop playing
            player.destroy();

            return message.channel.send(`⏹ Stopped and left your Channel`).then(msg => {
                try { msg.delete({ timeout: 10000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });
        }

        //skip the track
        player.stop();

        return message.channel.send(`⏭ Skipped to the next Song`).then(msg => {
            try { msg.delete({ timeout: 10000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
        });
    }
}