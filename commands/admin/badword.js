const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const { stripIndent } = require("common-tags");

module.exports = class BadWordCMD extends Command {
    constructor(client) {
        super(client, {
            name: "badword",
            memberName: "badword",
            group: "admin",
            description: "Bad word system",
            userPermissions: ["ADMINISTRATOR"],
            examples: ["badword add f", "badword role @Admin"],
            args: [
                {
                    key: "action",
                    prompt: "What do you want to do?",
                    type: "string",
                    default: "help"
                },
                {
                    key: "value",
                    prompt: "Give me a word",
                    type: "string",
                    default: ""
                }
            ]
        })
    }

    async run(message, { action, value }) {
        const prefix = message.guild.commandPrefix ? message.guild.commandPrefix : this.client.commandPrefix;
        let bwSettings = this.client.provider.getGuild(message.guild.id, "badword");

        switch (action) {
            case "reset":
                const defaultSetting = {
                    "status": false,
                    "list": [],
                    "ignorerole": []
                };
                let waitMsg = await message.channel.send(`Are you sure to do this?`);
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
                            waitMsg.edit(`Reset successful`);

                            message.client.provider.setGuild(message.guild.id, "badword", defaultSetting);
                        } catch (err) {
                            waitMsg.edit(`Error occured while restartting default setting`);
                            this.client.logger.error(err)
                        }
                    }
                    else if (reaction.emoji.name === "❎") {
                        waitMsg.reactions.removeAll();
                        waitMsg.edit(`Ok, I know you won't do that`);
                        collector.stop();
                    }
                });

                collector.on("end", collected => {
                    waitMsg.reactions.removeAll();
                    waitMsg.edit(`Timed out. :i`);
                });
                break;
            case "toggle":
                let status = bwSettings.status;

                bwSettings["status"] = !status;
                await this.client.provider.setGuild(message.guild.id, "badword", bwSettings);
                message.say(`${!status ? "Enabled" : "Disabled"} bad word system successully!`);
                break;

            case "add":
                if (!bwSettings.status) return message.reply(`System is currently disabled`);
                let bwListAdd = bwSettings.list;
                if (!value) return message.say(`Give me a word please`);
                const arrAdd = value.toLowerCase().split(" ");
                if (arrAdd.length > 1) return message.reply("currently support 1 word per command");
                if (bwListAdd.includes(arrAdd[0])) return message.reply("this word already in bad word list");
                bwListAdd.push(arrAdd[0])
                bwSettings["list"] = bwListAdd;

                try {
                    await this.client.provider.setGuild(message.guild.id, "badword", bwSettings);
                    message.say(`Added new bad word successully!`);
                } catch (err) {
                    this.client.logger.error(err);
                    message.say("Error while adding new word");
                }
                break;

            case "remove":
                if (!bwSettings.status) return message.reply(`System is currently disabled`);
                let bwListRemove = bwSettings.list;
                if (!value) return message.say(`Give me a word please`);
                const arrRemove = value.toLowerCase().split(" ");
                if (arrRemove.length > 1) return message.reply("currently support 1 word per command");
                if (!bwListRemove.includes(arrRemove[0])) return message.reply("this word not in bad word list");
                const index = bwListRemove.indexOf(arrRemove[0]);
                bwListRemove.slice(index, 1);
                bwSettings["list"] = bwListRemove;

                try {
                    await this.client.provider.setGuild(message.guild.id, "badword", bwSettings);
                    message.say(`Added new bad word successully!`);
                } catch (err) {
                    this.client.logger.error(err);
                    message.say("Error while adding remove word");
                }

                break;
            case "role":
                if (!bwSettings.status) return message.reply(`System is currently disabled`);
                let ignoreList = bwSettings.ignorerole;
                if (!value) return message.reply("Give me role name or ID to ignore");
                const role = this.client.registry.types.get("role").parse(value, message);
                if (!role) return message.reply("Invalid Role");
                if (!ignoreList.includes(role.id)) {
                    ignoreList.push(role.id)
                } else {
                    const index = bwListRemove.indexOf(role.id);
                    ignoreList.splice(index, 1);
                }

                bwSettings["ignorerole"] = ignoreList;
                try {
                    await this.client.provider.setGuild(message.guild.id, "badword", bwSettings);
                    message.say(`${ignoreList.includes(roleid) ? "Removed" : "Added"} ignore role successully!`);
                } catch (err) {
                    this.client.logger.error(err);
                    message.say("Error while adding new word")
                }
                break;
            case "list":
                let bwDisplay = bwSettings.list.length === 0 ? "None" : bwSettings.list.map(val => `\`${val}\``).join(", ");
                const embed = new MessageEmbed()
                    .setTitle("Bad word List")
                    .setDescription(bwDisplay)
                    .setTimestamp()
                    .setFooter(`Command ran at`);

                message.channel.send({ embed });
                break;
            case "help":
                const embed = new MessageEmbed()
                    .setTitle("Master Channel Help")
                    .setDescription(stripIndent`
                    ${prefix}badword reset: Reset settings.
                    ${prefix}badword add: Add badword to list.
                    ${prefix}badword remove: Remove badword from list.
                    ${prefix}badword help: Show this embed.
                    ${prefix}badword list: Show badword list.
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