const guildsettingskeys = require("../config/defaultServerSettings.json");
const usersettingskeys = require("../config/defaultUserSettings.json");
const botsettingskeys = require("../config/defaultBotSettings.json");
const now = new Date().getTime();

module.exports = async (client, message) => {
    // Ignore bot
    if (message.author.bot) return;
    // Everything will trigger when provider is ready
    if (!client.provider.isReady) return;
    // Ignore message from dm channel
    if (message.channel.type === "dm") return;

    // Check if guild setttings as same as default settings
    if (message.guild && client.provider.getGuild(message.guild.id)) {
        const settings = client.provider.guildSettings.get(message.guild.id);
        for (const key in guildsettingskeys) {
            if (!settings[key] && typeof settings[key] === "undefined") {
                settings[key] = guildsettingskeys[key];
            }
        }
        await client.provider.setGuildComplete(message.guild.id, settings);
    }

    // Check if user setttings as same as default settings
    if (client.provider.getUser(message.author.id)) {
        const settings = client.provider.userSettings.get(message.author.id);
        for (const key in usersettingskeys) {
            if (!settings[key] && typeof settings[key] === "undefined") {
                settings[key] = usersettingskeys[key];
            }

            if (typeof usersettingskeys[key] === "object") {
                for (const key2 in usersettingskeys[key]) {
                    if (!settings[key][key2]) {
                        settings[key][key2] = usersettingskeys[key][key2];
                    }
                }
            }
        }
        await message.client.provider.setUserComplete(message.author.id, settings);
    }
    else {
        await message.client.provider.reloadUser(message.author.id);
    }

    // Check if bot setttings as same as default settings
    if (client.provider.getBotsettings("botconfs")) {
        const settings = client.provider.botSettings.get("botconfs");
        for (const key in botsettingskeys) {
            if (!settings[key]) {
                settings[key] = botsettingskeys[key];
            }
        }
        await message.client.provider.setBotconfsComplete("botconfs", settings);
    }
    else {
        await message.client.provider.setBotconfsComplete("botconfs", botsettingskeys);
    }

    if (!client.provider.getGuild(message.guild.id, "prefix")) {
        await client.provider.setGuild(message.guild.id, "prefix", client.commandPrefix)
    }

    if (!client.provider.getGuild(message.guild.id, "guildID")) {
        await client.provider.setGuild(message.guild.id, "guildID", message.guild.id)
    }

    if (!client.provider.ChecktUserXPExist(message.authorid, message.guild.id)) {
        await client.provider.NewXP(message.author.id, message.guild.id)
    }
    const authorID = message.author.id;
    const guildID = message.guild.id;

    let currentUser = await client.provider.GetCurrentUser(authorID, guildID);
    const { xp, lastUpdated } = currentUser;
    const lastUpdatedTime = new Date(lastUpdated).getTime()

    // level settings
    const levelSettings = client.provider.getGuild(message.guild.id, "leveling");
    const xpSettings = levelSettings.settings;
    const roleReward = levelSettings.rolereward;
    const excludeSettings = levelSettings.xpexclude;

    // Exclude list
    const userList = excludeSettings.user;
    const roleList = excludeSettings.role;
    const channelList = excludeSettings.channel;
    const cateList = excludeSettings.category;

    if ((!userList.includes(message.author.id) || (message.channel.parentID && !cateList.includes(message.channel.parentID)) || !channelList.includes(message.channel.id) || !roleList.some(id => message.member.roles.cache.has(id))) && now > lastUpdatedTime + xpSettings.cooldown) {
        // xpcld = true;
        let amtToGive = Math.floor(Math.random() * (xpSettings.maxxp - xpSettings.minxp + 1)) + xpSettings.minxp;
        let currentlvl = Math.floor(Math.sqrt(xp) * 0.1);
        let newXP = xp + amtToGive;
        let nextlvl = Math.floor(Math.sqrt(newXP) * 0.1);
        await client.provider.UpdateXP(authorID, guildID, newXP);
        if (currentlvl !== nextlvl) {
            for (const key in roleReward) {
                let reward = roleReward[key];
                if (reward && !message.member.roles.cache.has(reward) && key <= nextlvl) {
                    message.member.roles.add(reward);
                }
            }

            message.channel.send(`GG <@${message.author.id}>, you just advanced to level ${nextlvl}!`);
        }
    }

    const bwSettings = client.provider.getGuild(message.guild.id, "badword");
    if (bwSettings.list.length > 0) {
        const bwExist = bwSettings.list.length > 1 ? new RegExp(bwSettings.list.join("|")).test(message.content) : new RegExp(bwSettings.list.join("")).test(message.content);
        if (bwSettings.status && message.content && bwExist && !message.member.hasPermission("ADMINISTRATOR") && !bwSettings.ignorerole.some(id => member.roles.cache.has(id))) {
            message.reply("bad word detected, be careful");
            await message.delete({ timeout: 1000 })
        }
    }
}