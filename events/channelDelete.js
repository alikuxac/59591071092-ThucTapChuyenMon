const { MessageEmbed } = require("discord.js");

module.exports = async (client, channel) => {
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 11,
    });
    let user = "User notfound";
    const deletedLog = fetchedLogs.entries.first();
    if (deletedLog) {
        const { executor } = deletedLog;
        user = executor.username;
    }

    const VoiceSettings = client.provider.getGuild(channel.guild.id, "voice");
    if (VoiceSettings.status && channel.type === "voice") {
        const VoiceID = client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceID) return;
        VoiceSettings.log && channel.guild.channels.cache.get(VoiceSettings.log).send({
            embed: new MessageEmbed()
                .setAuthor(`\`${user}\``)
                .setDescription(`\`${user}\ deleted channel \`${channel.name}\` with type ${VoiceID.type}`)
                .setColor("RED")
                .setTimestamp()
        })
    }
}