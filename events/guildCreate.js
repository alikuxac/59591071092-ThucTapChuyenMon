const guildsettingskeys = require("../config/defaultServerSettings.json");

module.exports = async (client, guild) => {
    if (!client.provider.isReady) return;

    guildsettingskeys.prefix = process.env.PREFIX;

    if (client.provider.getGuild(guild.id, "guildID")) {
        const guildSettings = client.provider.guildSettings.get(guild.id);
        for (const key in guildsettingskeys) {
            if (!guildSettings[key] && guildSettings[key] === 'undefined') {
                guildSettings[key] = guildsettingskeys[key];
            }
        }
        await client.provider.setGuildComplete(guild.id, guildSettings);
    } else {
        await client.provider.reloadGuild(guild.id);
    }

    if (process.env.JOIN_LEAVE_LOG) {
        client.channels.cache.get(process.env.JOIN_LEAVE_LOG).send(`✅ Joined guild **${guild.name}**. Total server(s): ${client.guilds.cache.size}.`);
    }
}