const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class BassboostCMD extends Command {
    constructor(client) {
        super(client, {
            name: "bassboost",
            memberName: "bassboost",
            group: "music",
            aliases: ["bassb", "bboost"],
            description: "Set boost level for player",
            guildOnly: true,
            args: [
                {
                    key: "level",
                    prompt: "Select boost level for player",
                    type: "string",
                    oneOf: ["none", "low", "medium", "high", "earrape"]
                }
            ]
        })
    }
    async run(message, { level }) {
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
                
        switch (level) {
            case `none`:
                player.setEQ(this.client.manager.bassboost.none);
                break;
            case `low`:
                player.setEQ(this.client.manager.bassboost.low);
                break;
            case `medium`:
                player.setEQ(this.client.manager.bassboost.medium);
                break;
            case `high`:
                player.setEQ(this.client.manager.bassboost.high);
            case `earrape`:
                player.setEQ(this.client.manager.bassboost.earrape);
                break;
        }
        return message.channel.send(new MessageEmbed()
            .setTitle(` Success | Bassboost set the to \`${level}\``)
            .setDescription(`Note: *It might take up to 5 seconds until you hear the new Equalizer*`)
        );
    }
}