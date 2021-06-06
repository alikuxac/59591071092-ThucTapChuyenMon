const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VCClaimCMD extends Command {
    constructor(client) {
        super(client, {
            nama: "vcclaim",
            memberName: "vcclaim",
            group: "voice",
            description: "Claim voice custom channel if no one or owner of channel not in channel",
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
        if (message.author.id === VoiceSearch.owner) return message.reply("Yyu are already owner of this voice channel");
        if (channel.members.find(member => member.id === VoiceSearch.owner)) return message.reply("owner of this channel is in here.")
        this.client.provider.getVCCollection().updateOne(
            {
                channelID: channel.id
            },
            {
                $set: {
                    owner: message.author.id,
                }
            }
        ).then(newChannel => {
            message.reply(`Claim channel successful`);  
            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                embed: new MessageEmbed()
                    .setAuthor(`${message.author.username}`)
                    .setTitle("Custom voice channel updated")
                    .setDescription(`Owner of voice channel \`${channel.name}\` changed to \`${message.author.id}\``)
                    .setColor("YELLOW")
                    .setTimestamp()
            })
        })
    }
}