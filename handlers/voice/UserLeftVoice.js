
module.exports = async (client, oldState) => {
    const VoiceSettings = client.provider.getGuild(newState.guild.id, "voice");
    const VoiceLog = VoiceSettings.log;
    const user = client.users.fetch(oldState.id);
    const LeftChannelID = oldState.channel.id;
    const VoiceSearch = client.provider.getVCCollection().findOne({ channelID: LeftChannelID });
    if (!VoiceSearch) return;

    // If no one left in the custom voice channel, delete it
    if (VoiceSearch && oldState.channel.members.size == 0) {
        await oldState.channel.delete().catch(() => { /* Do nothing */ });
        await client.provider.getVCCollection().deleteOne({ channelID: LeftChannelID })
            .then(val => {
                VoiceLog && oldState.guild.channels.cache.get(VoiceLog).send({
                    embed: new MessageEmbed()
                        .setAuthor(`${user.username}`)
                        .setTitle("Custom voice channel deleted")
                        .setDescription(`Voice channel (${oldState.channel.name}) deleted`)
                        .setColor("RED")
                        .setTimestamp()
                })
            })
    }
}