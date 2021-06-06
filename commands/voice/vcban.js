const Command = require("../../structures/Command");

module.exports = class VCBanCMD extends Command {
    constructor(client) {
        super(client, {
            name: "vcban",
            memberName: "vcban",
            group: "voice",
            description: "Ban an user from a voice channel",
            args: [
                {
                    key: "user",
                    prompt: "Who do want to ban?",
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
        if (user.id === VoiceSearch.owner) return message.reply("you can not ban yourself");
    }
}