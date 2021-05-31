const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
module.exports = class AutoPlayCMD extends Command {
    constructor(client) {
        super(client, {
            name: "autoplay",
            memberName: "autoplay",
            group: "music",
            description: "Toggle autoplay.",
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            guildOnly: true
        })
    }

    async run(message) {
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

        player.set(`autoplay`, !player.get(`autoplay`));
        return message.channel.send(new MessageEmbed()
            .setTitle(`Success | ${player.get(`autoplay`) ? `Enabled` : `Disabled`} Autoplay`)
            .setDescription(`To ${player.get(`autoplay`) ? `disable` : `enable`} it type: \`${this.client.commandPrefix}autoplay\``)
            .setColor("RANDOM")
        );
    }
}