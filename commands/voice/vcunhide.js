const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VCunhideCMD extends Command {
    constructor(client) {
        super(client, {
            name: "vcunhide",
            memberName: "vcunhide",
            group: "voice",
            description: "Unhide voice custom channel",
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
        const VoiceSearch = await this.client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceSearch) return message.reply("this is not a custom voice channel");
        if (message.author.id !== VoiceSearch.owner || !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only owner of this voice can run this command");
        channel.overwritePermissions([
            {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"]
            }
        ]).then(newChannel => {
            message.reply(`Voice channel \`${channel.name}\` hid successful`)
            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                embed: new MessageEmbed()
                    .setAuthor(`${message.author.username}`)
                    .setTitle("Custom voice channel updated")
                    .setDescription(`Voice channel \`${channel.name}\` hid successful`)
                    .setColor("YELLOW")
                    .setTimestamp()
            })
        })
    }
}