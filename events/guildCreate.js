const guildsettingskeys = require('../config/defaultServerSettings.json');

module.exports = async (client, guild) => {
    if (!client.provider.isReady) return;

    guildsettingskeys.prefix = process.env.PREFIX;

    const guildSettings = client.provider.initGuildMap(guild.id);
    for (const key in guildsettingskeys) {
        if (!guildSettings[key] && guildSettings[key] === 'undefined') {
            guildSettings[key] = guildsettingskeys[key];
        }
    }
    await client.provider.setGuildComplete(guild.id, guildSettings);
}