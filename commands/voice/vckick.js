const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VNameCMD extends Command {
    constructor(client) {
        super(client, {
            name: "vname",
            memberName: "vname",
            group: "voice",
            description: "Change voice custom channel name",
            guildOnly: true,
            args: [
                {
                    key: "name",
                    prompt: "what name do you want to change?",
                    type: "string",
                    validate: name => {
                        if (name.length > 50) return "Name must be under 50 characters";
                        return true
                    }
                }
            ]
        })
    }

    async run(message, { name }) {
        const VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");
        const VoiceLog = VoiceSettings.log;
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command");
        const VoiceSearch = this.client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceSearch) return message.reply("this is not a custom voice channel");
        channel.setName(name).then(newChannel => {
            this.client.provider.getVCCollection().updateOne(
                {
                    channelID: channel.id
                },
                {
                    $set: {
                        vname: name,
                        name: name
                    }
                }
            ).then(val => {
                VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                    embed: new MessageEmbed()
                        .setAuthor(`${message.author.username}`)
                        .setTitle("Custom voice channel updated")
                        .setDescription(`Voice channel \`${channel.name}\` changed name to \`${name}\``)
                        .setColor("YELLOW")
                        .setTimestamp()
                })
            })
        })
    }
}