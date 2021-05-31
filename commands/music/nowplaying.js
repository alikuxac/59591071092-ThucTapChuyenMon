const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class NowPlayingCMD extends Command {
    constructor(client) {
        super(client, {
            name: "nowplaying",
            memberName: "nowplaying",
            group: "music",
            aliases: ["np"],
            description: "Show current song of the player"
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
        //if not in the same channel as the player,
        if (channel.id !== player.voiceChannel)
            return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use command`)
                .then(msg => {
                    try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
                });
        const current = player.queue.current;
        const embed = new MessageEmbed()
            .setAuthor(current.author)
            .setDescription(`Now playing: [${current.title}](${current.uri}) (${this.client.manager.util.format(current.duration)})`)
            .setThumbnail(current.thumbnail)
            .setFooter(`Requested by ${current.requester.username}#${current.requester.discriminator}`)

        return message.channel.send({ embed });
    }
}