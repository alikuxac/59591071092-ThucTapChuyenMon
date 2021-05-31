module.exports = async (client, guild) => {
    if (!client.provider.isReady) return;

    if (process.env.JOIN_LEAVE_LOG){
        client.channels.cache.get(process.env.JOIN_LEAVE_LOG).send(`❌ Left guild **${guild.name}**. Total server(s): ${client.guilds.cache.size}.`);
        }
}