const guildsettingskeys = require('../config/defaultServerSettings.json');

module.exports = async (client, guild) => {
    if (!client.provider.isReady) return;

    const guildSettings = client.provider.initGuildMap(guild.id);
    for (const key in guildsettingskeys) {
        if (!guildSettings[key] && guildSettings[key] === 'undefined') {
            guildSettings[key] = guildsettingskeys[key];
        }
    }
    await client.provider.setGuildComplete(guild.id, guildSettings);
}