const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = class LevelingCMD extends Command {
    constructor(client) {
        super(client, {
            name: "leveling",
            memberName: "leveling",
            group: "level",
            description: "Setup leveling thing for server",
            aliases: ["lvl"],
            guildOnly: true,
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            examples: ["leveling set minxp 1", "leveling set maxxp 50"],
            args: [
                {
                    key: "action",
                    prompt: "What do you want with this?",
                    type: "string",
                    default: "help"
                },
                {
                    key: "key",
                    prompt: "What key do you want to set?",
                    type: "string",
                    default: ""
                },
                {
                    key: "value",
                    prompt: "What value do you want to set?",
                    type: "string",
                    default: ""
                }
            ]
        })
    }
    async run(message, args) {

        let helpdecs = `\`leveling use-default\`: Use the default settings\n
		\`leveling set <key> <value>\`: Sets the given settings to the value provided. Valid keys are \"min\", \"max\" and \"cooldown\" (duration)."\n
		\`leveling view\`: Views the current settings.`
        const helpEmbed = new MessageEmbed()
            .setTitle(`🏆 Leveling`)
            .setDescription(helpdecs)
            .setColor(14232643)
        let allsettings = message.client.provider.getGuild(message.guild.id, "leveling");
        let xpSettings = allsettings.settings;
        let setresponse = "";
        let def = { minxp: 5, maxxp: 10, cooldown: 90000 };
        switch (args.action) {
            case "use-default":
                for (const key in def) {
                    xpSettings[key] = def[key];
                }
                try {
                    allsettings["settings"] = xpSettings;
                    await message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                    message.channel.send(`Done! You are now using the default settings for the leveling system.`);
                } catch (err) {
                    message.channel.send(`Error occured while restartting default setting`);
                    this.client.logger.error(err)
                }
                break;
            case "set":
                let setvalue = args.value;
                switch (args.key) {
                    case "minxp":
                        if (!parseInt(setvalue)) return message.reply("Invalid value type");
                        if (parseInt(setvalue) > parseInt(xpSettings.maxxp)) return message.reply(`The minimum xp cannot be larger than or equal to the max xp.`)
                        xpSettings.minxp = parseInt(setvalue);
                        setresponse = `Set \`${args.key}\` to ${setvalue}`
                        break;
                    case "maxxp":
                        if (!parseInt(setvalue)) return message.reply("Invalid value type");
                        if (parseInt(setvalue) < parseInt(xpSettings.minxp)) return message.reply(`The maximum xp cannot be less than or equal to the min xp.`)
                        xpSettings.maxxp = parseInt(setvalue);
                        setresponse = `Set \`${args.key}\` to ${setvalue}`
                        break;
                    case "cooldown":
                        let duration = moment.duration(setvalue);
                        if (!moment.isDuration(duration)) return message.reply(`Invalid duration. Only support \`HH:MM:SS\``)
                        xpSettings.cooldown = duration.asMilliseconds()
                        setresponse = `Set \`${args.key}\` to ${duration.hours()}h${duration.minutes()}m${duration.seconds()}s`
                        break;
                    default:
                        message.reply(`That was not a valid key. The only valid settings are "min", "max", and "cooldown".`)
                        break;
                }
                try {
                    allsettings["settings"] = xpSettings;
                    await message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                    message.channel.send(setresponse);
                } catch (err) {
                    message.channel.send(`Error occured while setting \`${args.key}\``)
                    this.client.logger.error(err)
                }
                break;
            case "view":
                let cldview = moment.duration(xpSettings.cooldown);
                let descview = `**❯ Minimum XP:** ${xpSettings.minxp}
                \n**❯ Maximum XP:** ${xpSettings.maxxp}
                \n**❯ Cooldown:** ${cldview.hours()}h${cldview.minutes()}m${cldview.seconds()}s`
                const viewEmbed = new MessageEmbed()
                    .setTitle(`Level Settings`)
                    .setDescription(descview)
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
    onBlock(message, reason, data) {
        if (reason === "permission") return message.reply(`${data.response}`);
    }
}

// [█](https://imgur.com/a/HT2qQvo)████████ ${tempVars("test2")}% | ${tempVars("mylvl") + 1}