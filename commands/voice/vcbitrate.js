const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VCBitrateCMD extends Command {
    constructor(client) {
        super(client, {
            nama: "vcbitrate",
            memberName: "vcbitrate",
            group: "voice",
            guildOnly: true,
            description: "Change bitrate of voice custom channel ",
            args: [
                {
                    key: "bitrate",
                    prompt: "what name do you want to change?",
                    type: "integer",
                    validate: bitrate => {
                        if (bitrate.length > 96 || bitrate.length < 8) return "Bitrate must be between 8 and 96";
                        return true
                    }
                }
            ]
        })
    }

    async run(message, { bitrate }) {
        const VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");
        const VoiceLog = VoiceSettings.log;
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command");
        const VoiceSearch = this.client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceSearch) return message.reply("this is not a custom voice channel");
        if (message.author.id !== VoiceSearch.owner || !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only owner of this voice can run this command");
        channel.setBitrate(bitrate).then(newChannel => {
            this.client.provider.getVCCollection().updateOne(
                {
                    channelID: channel.id
                },
                {
                    $set: {
                        bitrate: bitrate,
                    }
                }
            ).then(val => {
                message.reply(`Voice channel \`${channel.name}\` changed bitrate from ${channel.bitrate} to \`${newChannel.bitrate}\``);
                VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                    embed: new MessageEmbed()
                        .setAuthor(`${message.author.username}`)
                        .setTitle("Custom voice channel updated")
                        .setDescription(`Voice channel \`${channel.name}\` changed bitrate from ${channel.bitrate} to \`${newChannel.bitrate}\``)
                        .setColor("YELLOW")
                        .setTimestamp()
                })
            })
        })
    }
}