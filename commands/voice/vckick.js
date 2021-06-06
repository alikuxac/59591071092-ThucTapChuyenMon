const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class vckickCMD extends Command {
    constructor(client) {
        super(client, {
            name: "vckick",
            memberName: "vckick",
            group: "voice",
            description: "Kick user from channel",
            guildOnly: true,
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to kick?",
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
        const VoiceSearch = await this.client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceSearch) return message.reply("this is not a custom voice channel");
        const targetChannel = user.member.voice.channel;
        if (!targetChannel) return message.reply("user not in voice channel");
        user.member.voice.setChannel(null).then(val => {
            message.say(`Kicked \`${user.username}\``);
        });
    }
}