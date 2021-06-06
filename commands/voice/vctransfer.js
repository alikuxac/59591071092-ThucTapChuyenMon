const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VCTrandferCMD extends Command {
    constructor(client) {
        super(client, {
            name: "vctransfer",
            memberName: "vctransfer",
            group: "voice",
            description: "Transfer owner to another user",
            guildOnly: true,
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to transfer?",
                    type: "user"
                }
            ]
        })
    }

    async run(message, { user }) {
        const VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");
        const VoiceLog = VoiceSettings.log;
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command");
        const VoiceSearch = this.client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceSearch) return message.reply("this is not a custom voice channel");
        this.client.provider.getVCCollection().updateOne(
            {
                channelID: channel.id
            },
            {
                $set: {
                    owner: user.id,
                }
            }
        ).then(newChannel => {
            message.reply(`Transfer owner of channel to \`${user.username}\` successful`);
            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                embed: new MessageEmbed()
                    .setAuthor(`${message.author.username}`)
                    .setTitle("Custom voice channel updated")
                    .setDescription(`Owner of voice channel \`${channel.name}\` transferred to <@${user.id}>`)
                    .setColor("YELLOW")
                    .setTimestamp()
            })
        })
    }
}