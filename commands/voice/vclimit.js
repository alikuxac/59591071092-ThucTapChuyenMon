const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VCLimitCMD extends Command {
    constructor(client) {
        super(client, {
            name: "vclimit",
            memberName: "vclimit",
            group: "voice",
            description: "Change voice custom channel limit",
            guildOnly: true,
            args: [
                {
                    key: "limit",
                    prompt: "How many user do you want to limit?",
                    type: "integer",
                    validate: limit => {
                        if (limit.length > 99 || limit < 0) return "Limit must be between 0 and 99";
                        return true
                    }
                }
            ]
        })
    }

    async run(message, { limit }) {
        const VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");
        const VoiceLog = VoiceSettings.log;
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command");
        const VoiceSearch = await this.client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceSearch) return message.reply("this is not a custom voice channel");
        channel.setUserLimit(limit).then(newChannel => {
            this.client.provider.getVCCollection().updateOne(
                {
                    channelID: channel.id
                },
                {
                    $set: {
                        userLimit: limit,
                    }
                }
            ).then(val => {
                message.reply(`Set user limit of channel to ${limit}`);
                VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                    embed: new MessageEmbed()
                        .setAuthor(`${message.author.username}`)
                        .setTitle("Custom voice channel updated")
                        .setDescription(`Voice channel \`${channel.name}\` changed user limit to \`${limit}\``)
                        .setColor("YELLOW")
                        .setTimestamp()
                })
            })
        })
    }
}