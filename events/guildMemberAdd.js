const usersettingskeys = require("../config/defaultUserSettings.json");
module.exports = async (client, member) => {

    // Ignore if provider is not ready
    if (!client.provider.isReady) return;

    if (client.provider.getGuild(member.id, "userID")) {
        const userSettings = client.provider.userSettings.get(guild.id);
        for (const key in usersettingskeys) {
            if (!userSettings[key] && guildSettings[key] === 'undefined') {
                userSettings[key] = usersettingskeys[key];
            }
        }
        await client.provider.setUserComplete(member.id, userSettings);
    } else {
        await client.provider.reloadUser(member.id);
    }

    // Check if user has level in current guild before
    if (!client.provider.ChecktUserXPExist(member.id, member.guild.id) && !member.user.bot){
        await client.provider.NewXP(member.id, member.guild.id);
    }
}