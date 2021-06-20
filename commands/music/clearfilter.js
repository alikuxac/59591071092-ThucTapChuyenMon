const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class ClearFilterCMD extends Command {
    constructor(client) {
        super(client, {
            name: "clearfilter",
            memberName: "clearfilter",
            group: "music",
            aliases: ["clearfil"],
            description: "Clear filter for player",
            guildOnly: true,
        })
    }
    async run(message) {
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command")
        //get the player instance
        const player = this.client.manager.players.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.")
        //if not in the same channel as the player,
        if (channel.id !== player.voiceChannel)
            return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use command`)
        player.clearEQ();
        return message.channel.send(new MessageEmbed()
            .setTitle(`Success | Resetted the Equalizer`)
            .addField(`Equalizer: `, `Nothing`)
            .setDescription(`Note: *It might take up to 5 seconds until you hear the new Equalizer*`)
        );
    }
}