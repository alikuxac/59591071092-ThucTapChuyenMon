const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VCPushtotalkCMD extends Command {
    constructor(client) {
        super(client, {
            nama: "vcpushtotalk",
            memberName: "vcpushtotalk",
            group: "voice",
            description: "Change pushtotalk mode of voice custom channel",
            guildOnly: true
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
        if (message.author.id !== VoiceSearch.owner || !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only owner of this voice can run this command");
        let status = !VoiceSearch.pushtotalk;
        if (status) {
            await channel.overwritePermissions([{ id: newState.guild.id, deny: ["USE_VAD"] }]);
        } else {
            await channel.overwritePermissions([{ id: newState.guild.id, allow: ["USE_VAD"] }]);
        }

        this.client.provider.getVCCollection().updateOne(
            {
                channelID: channel.id
            },
            {
                $set: {
                    pushtotalk: status,
                }
            }
        ).then(val => {
            message.reply(`${status ? "Enabled" : "Disabled"} push to talk mode successful`);
            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                embed: new MessageEmbed()
                    .setAuthor(`${message.author.username}`)
                    .setTitle("Custom voice channel updated")
                    .setDescription(`${status ? "Enabled" : "Disabled"} push to talk mode of voice channel \`${channel.name}\` successful`)
                    .setColor("YELLOW")
                    .setTimestamp()
            })
        })
    }
}