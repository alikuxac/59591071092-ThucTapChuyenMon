const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldState) => {
    const VoiceSettings = client.provider.getGuild(oldState.guild.id, "voice");
    const VoiceLog = VoiceSettings.log;
    const user = await client.users.fetch(oldState.id);
    const oldChannel = await oldState.guild.channels.cache.get(oldState.channelID);
    const VoiceSearch = await client.provider.getVCCollection().findOne({ channelID: oldState.channelID })
    if (!VoiceSearch) return;

    // If no one left in the custom voice channel, delete it
    if (VoiceSearch && oldState.channel.members.size == 0) {
        await oldChannel.delete().catch();
        client.provider.getVCCollection().deleteOne({ channelID: oldState.channelID })
            .then(val => {
                VoiceLog && oldState.guild.channels.cache.get(VoiceLog).send({
                    embed: new MessageEmbed()
                        .setAuthor(`${user.username}`)
                        .setTitle("Voice channel deleted")
                        .setDescription(`Voice channel \`${oldChannel.name}\` (${VoiceSearch.type}) deleted`)
                        .setColor("RED")
                        .setTimestamp()
                })
            })
    }
}