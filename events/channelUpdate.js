module.exports = async (client, oldChannel, newChannel) => {
    if (!client.provider.isReady) return;
    if (!oldChannel || !newChannel) return;
    const channelID = oldChannel.id || newChannel.id
    const VoiceSettings = client.provider.getGuild(newChannel.guild.id, "voice");
    const VoiceSearch = await client.provider.getVCCollection().findOne({ channelID });
    if (VoiceSettings.status && (newChannel.type === "voice" || oldChannel.type === "voice")) {
        if (newChannel.parent !== oldChannel.parent) {
            VoiceSearch && await client.provider.getVCCollection().updateOne(
                {
                    channelID
                },
                {
                    $set: {
                        parent: newChannel.parent
                    }
                }
            )
        }
    }
}