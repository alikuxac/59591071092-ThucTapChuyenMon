const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class RoleRewardCMD extends Command {
    constructor(client) {
        super(client, {
            name: "rolereward",
            memberName: "rolereward",
            group: "admin",
            description: "Set role reward for server",
            userPermission: ["ADMINISTRATOR"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            examples: ["rolereward add 5 @Bronze"],
            aliases: ["rr"],
            args: [
                {
                    key: "action",
                    prompt: "What action do you want to do?",
                    type: "string",
                    default: "help"
                },
                {
                    key: "level",
                    prompt: "What level do you want to set?",
                    type: "integer",
                    default: ""
                },
                {
                    key: "role",
                    prompt: "What role do you want to set with that level?",
                    type: "role",
                    default: ""
                }
            ]
        });
    }
    async run(message, args) {

        let helpdecs = `\`rolerewards add <level> <role>\`: Adds a role reward at the given level
		\n\`rolerewards remove <level>: Removes the role reward from the given level
		\n\`rolerewards reset: Resets role reward settings."
		\n\`rolerewards view: Views current settings for role rewards.`

        const helpEmbed = new MessageEmbed()
            .setTitle(`🏆 Leveling`)
            .setDescription(helpdecs)
            .setColor(14232643)
        let allsettings = message.client.provider.getGuild(message.guild.id, "leveling");
        let rrSettings = allsettings.rolereward;
        switch (args.action) {
            case "reset":
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
                            rrSettings = {};
                            allsettings["rolereward"] = rrSettings;
                            message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                            message.channel.send("Reset successful.");
                        } catch (err) {
                            waitMsg.edit(`Error occured while restartting default setting`);
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
            case "add":
                let addlevel = args.level;
                let role = args.role
                if (rrSettings[addlevel]) return message.reply(`Already have role reward with this level`)
                if (!role) return message.reply(`Invalid role`);
                try {
                    rrSettings[addlevel] = role.id.toString()
                    allsettings["rolereward"] = rrSettings;
                    message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                    message.channel.send(`Successfully set the role  \`${role.name}\` to be given at the level ${addlevel}.`)
                } catch (err) {
                    this.client.logger.error(err)
                    message.channel.send(`Error while add role reward`)
                }
                break;

            case "remove":
                let dellevel = args.level;
                if (!rrSettings[dellevel]) return message.reply(`Already have role reward with this level`)
                try {
                    delete rrSettings[dellevel]
                    allsettings["rolereward"] = rrSettings;
                    message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                    message.channel.send(`Successfully removed the role reward from the level ${dellevel}.`)
                } catch (err) {
                    client.logger.error(err);
                    message.channel.send(`Error while remove role reward from that level`)
                }
                break;

            case "view":
                let viewdesc = "";
                if (Object.keys(rrSettings).length === 0) {
                    viewdesc = "n/a";
                }
                else {
                    for (const level in rrSettings) {
                        viewdesc += `\n**Level ${level}:** <@&${rrSettings[level]}>`
                    }
                }

                const viewEmbed = new MessageEmbed()
                    .setTitle(`Role Rewards`)
                    .setDescription(`**Role Rewards:** ${viewdesc}`)
                    .setThumbnail(`https://i.imgur.com/mJ7zu6k.png`)
                message.channel.send({ embed: viewEmbed })
                break;
            case "help":
                message.channel.send({ embed: helpEmbed })
                break;
            default:
                break;
        }
    }
}