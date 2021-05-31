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
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command").then(msg => {
            try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
        });
        const player = this.client.manager.players.get(message.guild.id)

        if (!player) return message.reply("there is no player for this guild.")
            .then(msg => {
                try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });
        if (!args.volume) return message.reply(`the player volume is \`${player.volume}\`%.`)
            .then(msg => {
                try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });

        const { channel } = message.member.voice;

        if (!channel) return message.reply("you need to join a voice channel.")
            .then(msg => {
                try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });
        if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.")
            .then(msg => {
                try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });

        const volume = Number(args.volume);

        if (!volume || volume < 1 || volume > 200) return message.reply("you need to give me a volume between 1 and 200.")
            .then(msg => {
                try { msg.delete({ timeout: 10000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });

        player.setVolume(volume);
        return message.reply(`set the player volume to \`${volume}\`%.`)
            .then(msg => {
                try { msg.delete({ timeout: 10000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
            });
    }
}