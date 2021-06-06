const { MessageEmbed } = require("discord.js");

module.exports = async (client, channel) => {
    if (!client.provider.isReady) return;
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 11,
    });
    let user = "User not found";
    const deletedLog = fetchedLogs.entries.first();
    if (deletedLog) {
        const { executor } = deletedLog;
        user = executor.username;
    }

    const VoiceSettings = client.provider.getGuild(channel.guild.id, "voice");
    if (VoiceSettings.status && channel.type === "voice") {
        const VoiceID = await client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceID) return;
        client.provider.getVCCollection().deleteOne({ channelID: channel.id }).then(val => {
            VoiceSettings.log && channel.guild.channels.cache.get(VoiceSettings.log).send({
                embed: new MessageEmbed()
                    .setAuthor(`\`${user}\``)
                    .setDescription(`\`${user}\` deleted channel \`${channel.name}\` with type \`${VoiceID.type}\``)
                    .setColor("RED")
                    .setTimestamp()
            })
        })  

    }
}