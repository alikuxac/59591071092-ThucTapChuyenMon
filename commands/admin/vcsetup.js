const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const { stripIndent } = require("common-tags");
module.exports = class VCSetup extends Command {
    constructor(client) {
        super(client, {
            name: "vcsetup",
            memberName: "vcsetup",
            group: "admin",
            description: "Setup auto voice system",
            guildOnly: true,
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["MANAGE_CHANNELS"],
            examples: ["vcsetup log #voice-log", "vcsetup limit 10"],
            args: [
                {
                    key: "action",
                    prompt: "What do you want to do?",
                    type: "string",
                    default: "help"
                },
                {
                    key: "value",
                    prompt: "Give me the value please",
                    type: "text-channel|integer",
                    default: ""
                }
            ]
        })
    }

    async run(message, { action, value }) {
        const prefix = message.guild.commandPrefix ? message.guild.commandPrefix : this.client.commandPrefix;
        let VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");

        switch (action) {
            case "reset":
                const defaultSettings = {
                    status: false,
                    limit: 50,
                    log: ""
                };

                let waitMsg = await message.channel.send(`Are you sure to do this?`)
                waitMsg.react("✅")
                waitMsg.react("❎")
                const filter = (reaction, user) => {
                    return ["✅", "❎"].includes(reaction.emoji.name) && user.id === message.author.id
                }
                const collector = waitMsg.createReactionCollector(filter, { time: 30000 });
                collector.on("collect", (reaction, user) => {
                    if (reaction.emoji.name === "✅") {
                        waitMsg.reactions.removeAll();
                        try {
                            waitMsg.edit(`Reset voice setting successful`);
                            message.client.provider.setGuild(message.guild.id, "voice", defaultSettings);
                            message.channel.send("Reset successful.");
                        } catch (err) {
                            waitMsg.edit(`Error occured while restarting default setting`);
                            this.client.logger.error(err)
                        }
                    }
                    else if (reaction.emoji.name === "❎") {
                        waitMsg.reactions.removeAll();
                        waitMsg.edit(`Ok, i know you wont do that, sily`);
                        collector.stop();
                    }
                });

                collector.on("end", collected => {
                    waitMsg.reactions.removeAll();
                    waitMsg.edit(`Timed out. :i`)
                });

                break;
            case "toggle":
                let status = !VoiceSettings.status;
                VoiceSettings["status"] = status;

                try {
                    await this.client.provider.setGuild(message.guild.id, "voice", VoiceSettings);
                    message.say(`${status ? "Enabled" : "Disabled"} auto voice system successfully.`);
                } catch (err) {
                    throw err;
                }
                break;
            case "log":
                if (!value) return message.reply("invalid value");
                const channel = typeof value !== "number";
                if (!channel) return message.reply("invalid text channel. Please try again");
                VoiceSettings["log"] = value.id + "";
                try {
                    await this.client.provider.setGuild(message.guild.id, "voice", VoiceSettings);
                    message.say(`Set voice log to <#${value.id}> successfully.`);
                } catch (err) {
                    throw err;
                }
                break;

            case "limit":
                if (!value) return message.reply("invalid value");
                if (typeof value !== "number") return message.reply("invalid number");
                if (parseInt(value) > 100) return message.reply("value must be under 100");
                VoiceSettings["limit"] = parseInt(value);
                try {
                    await this.client.provider.setGuild(message.guild.id, "voice", VoiceSettings);
                    message.say(`Set voice limit to \`${value}\` successfully.`);
                } catch (err) {
                    throw err;
                }
                break;
            case "help":
                const embed = new MessageEmbed()
                    .setTitle("Master Channel Help")
                    .setDescription(stripIndent`
                ${prefix}vcsetup toggle: Change status of system.
                ${prefix}vcsetup log: Set log channel for voice log.
                ${prefix}vcsetup limit: Limit number of voice channels can be create.
                `)
                    .setColor("GREEN")
                    .setTimestamp();
                message.channel.send({ embed });
                break;
            default:
                break;
        }
    }
}