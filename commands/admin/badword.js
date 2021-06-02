const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class BadWordCMD extends Command {
    constructor(client) {
        super(client, {
            name: "badword",
            memberName: "badword",
            group: "admin",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "action",
                    prompt: "What do you want to do?",
                    type: "string"
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
        let bwSettings = this.client.provider.getGuild(message.guild.id, "badword");

        switch (action) {
            case "reset":
                const defaultSetting = {
                    "status": false,
                    "list": []
                }
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
                            waitMsg.edit(`Reset successful`);

                            await message.client.provider.setGuild(message.guild.id, "badword", defaultSetting);
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
                    waitMsg.edit(`Timed out. :i`)
                });
                break;
            case "toggle":
                let status = bwSettings.status;

                bwSettings["status"] = !status;
                await this.client.provider.setGuild(message.guild.id, "badword", bwSettings);
                message.say(`${!status ? "Enabled" : "Disabled"} bad word system successully!`);
                break;

            case "add":
                let bwListAdd = bwSettings.list;
                if (!value) return message.say(`Give me a word please`);
                const arr = value.toLowerCase().split(" ");
                if (arr.length > 1) return message.reply("currently support 1 word per command");
                if (bwListAdd.includes(arr[0])) return message.reply("this word already in bad word list");
                bwListAdd = bwListAdd.push(arr[0])
                bwSettings["list"] = bwListAdd;

                try {
                    await this.client.provider.setGuild(message.guild.id, "badword", bwSettings);
                    message.say(`Added new bad word successully!`);
                } catch (err) {
                    this.client.logger.error(err);
                    message.say("Error while adding new word")
                }

                break;

            case "remove":

                let bwListRemove = bwSettings.list;
                if (!value) return message.say(`Give me a word please`);
                const arr = value.toLowerCase().split(" ");
                if (arr.length > 1) return message.reply("currently support 1 word per command");
                if (!bwListRemove.includes(arr[0])) return message.reply("this word not in bad word list");
                const index = bwListRemove.indexOf(arr[0]);
                bwListRemove = bwListRemove.slice(index, 1);
                bwSettings["list"] = bwListRemove;

                try {
                    await this.client.provider.setGuild(message.guild.id, "badword", bwSettings);
                    message.say(`Added new bad word successully!`);
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

            default:
                break;
        }
    }
}