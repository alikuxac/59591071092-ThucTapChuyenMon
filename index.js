require("dotenv").config();
const Client = require("./structures/Client");
const exec = require("child_process").exec;

const client = new Client({
    commandPrefix: "!!",
    owner: process.env.OWNERS.split(","),
    invite: process.env.INVITE,
    ws: {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_BANS", "GUILD_EMOJIS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_INTEGRATIONS"]
    },
    partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
    fetchAllMembers: true,
    restTimeOffset: 0,
    restWsBridgeTimeout: 100
});

client.build();

// Utility

// Automatic check update from repository every 30s.
setInterval(() => {
    exec(`git pull origin master`, (error, stdout) => {
        let response = (error || stdout);
        if (!error) {
            if (response.includes("Already up to date.")) {
                //client.logger.log("Bot already up to date. No changes since last pull")
            } else {
                client.channels.cache.get(process.env.GITHUB_LOG).send("**[AUTOMATIC]** \nNew update on GitHub. Pulling. \n\nLogs: \n```" + response + "```" + "\n\n\n**Restarting bot**")
                setTimeout(() => {
                    process.exit();
                }, 1000)
            };
        }
    })
}, 30000)