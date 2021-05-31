const guildsettingskeys = require("../config/defaultServerSettings.json");
const usersettingskeys = require("../config/defaultUserSettings.json");
const botsettingskeys = require("../config/defaultBotSettings.json");
const now = new Date().getTime();

module.exports = async (client, message) => {
    // Ignore bot
    if (message.author.bot) return;
    // Everything will trigger when provider is ready
    if (!client.provider.isReady) return;

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

    if (!client.provider.getGuild(message.guild.id, "cooldown")[message.author.id]) {
        const currentCooldowns = client.provider.getGuild(message.guild.id, "cooldowns");
        currentCooldowns[message.author.id] = {};
        await client.provider.setGuild(message.guild.id, "cooldowns", currentCooldowns);
    }

    let cooldowns = client.provider.getGuild(message.guild.id, "cooldown");
    let xpcld = false;
    let xp = client.provider.getUser(message.author.id, "leveling");
    let serverXP = xp["server"][message.guild.id];

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

    if (userList.includes(message.author.id) || (message.channel.parentID && cateList.includes(message.channel.parentID)) || channelList.includes(message.channel.id) || roleList.some(id => message.member.roles.cache.has(id))) {
        xpcld = true;
    }

    if (cooldowns[message.author.id]["leveling"]) {
        const expirationTime = cooldown[message.author.id]["xp"];
        const nextexpirationTime = now + xpSettings.cooldown;
        // If cooldown exprired
        if (now < expirationTime) {
            xpcld = true;
        } else {
            cooldown[message.author.id]["xp"] = nextexpirationTime;
            await client.provider.setGuild(message.guild.id, "cooldown", cooldown);
        }
    }

    if (!xpcld) {
        let amtToGive = Math.floor(Math.random() * (xpSettings.maxxp - xpSettings.minxp + 1)) + xpSettings.minxp;
        let currentlvl = Math.floor(Math.sqrt(serverXP) * 0.1);
        serverXP += amtToGive;
        let nextlvl = Math.floor(Math.sqrt(serverXP) * 0.1);
        xp["server"][message.guild.id] = serverXP;
        await client.provider.setUser(message.author.id, "leveling", xp);
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
}