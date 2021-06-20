const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class XpExclude extends Command {
    constructor(client) {
        super(client, {
            name: "xpexclude",
            memberName: "xpexclude",
            description: "Exclude XP in the server",
            group: "level",
            aliases: ["xpex"],
            guildOnly: true,
            userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            examples: ["xpexclude user @Alikuxac", "xpexclude role Spam"],
            args: [
                {
                    key: "action",
                    prompt: "What do you want to do?",
                    type: "string",
                    oneOf: ["user", "channel", "cate", "category", "role", "list"],
                    default: "list"
                },
                {
                    key: "value",
                    prompt: "Select the thing you want to exclude",
                    type: "user|role|channel|category-channel",
                    default: ""
                }
            ]
        })
    }

    async run(message, { action, value }) {
        const replyList = {
            "deluser": "This user is no longer excluded from level system in this server",
            "adduser": "This user has been excluded from level system in this server",
            "delrole": "This role is no longer excluded from level system in this server",
            "addrole": "This role has been excluded from level system in this server",
            "delchannel": "This channel is no longer excluded from level system in this server",
            "addchannel": "This channel has been excluded from level system in this server",
            "delcate": "This category is no longer excluded from level system in this server",
            "addcate": "This category has been excluded from level system in this server"
        };
        let msg = "";
        let allsettings = message.client.provider.getGuild(message.guild.id, "leveling");
        let excludeSettings = allsettings.xpexclude;

        let userList = excludeSettings.user;
        let roleList = excludeSettings.role;
        let channelList = excludeSettings.channel;
        let cateList = excludeSettings.category;
        switch (action) {
            case "user":
                if (userList.includes(value.id)) {
                    let index = userList.indexOf(value.id);
                    userList.splice(index, 1);
                    msg = replyList.deluser;
                } else {
                    userList.push(value.id);
                    msg = replyList.adduser;
                }

                excludeSettings["user"] = userList;
                allsettings["xpexclude"] = excludeSettings;
                await message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                message.channel.send(msg);
                break;
            case "channel":
                if (channelList.includes(value.id)) {
                    let index = channelList.indexOf(value.id);
                    channelList.splice(index, 1);
                    msg = replyList.delchannel;
                } else {
                    channelList.push(value.id);
                    msg = replyList.addchannel;
                }

                excludeSettings["channel"] = channelList;
                allsettings["xpexclude"] = excludeSettings;
                await message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                message.channel.send(msg);
                break;
            case "role":
                if (roleList.includes(value.id)) {
                    let index = roleList.indexOf(value.id);
                    roleList.splice(index, 1);
                    msg = replyList.delrole
                } else {
                    roleList.push(value.id);
                    msg = replyList.addrole
                }

                excludeSettings["role"] = roleList;
                allsettings["xpexclude"] = excludeSettings;
                await message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                message.channel.send(msg);
                break;
            case "category":
            case "cate":
                if (cateList.includes(value.id)) {
                    let index = cateList.indexOf(value.id);
                    cateList.splice(index, 1);
                    msg = replyList.delcate;
                } else {
                    cateList.push(value.id);
                    msg = replyList.addcate;
                }

                excludeSettings["category"] = cateList;
                allsettings["xpexclude"] = excludeSettings;
                await message.client.provider.setGuild(message.guild.id, "leveling", allsettings);
                message.channel.send(msg);
                break;
            case "list":

                let userDisplay = userList.length === 0 ? "None" : userList.map(value => `<@${value}>`).join(" ");
                let channelDisplay = channelList.length === 0 ? "None" : channelList.map(value => `<#${value}>`).join(" ");
                let roleDisplay = roleList.length === 0 ? "None" : roleList.map(value => `<@&${value}>`).join(" ");
                let cateDisplay = cateList.length === 0 ? "None" : cateList.map(value => `<#${value}>`).join(" ");

                const embed = new MessageEmbed()
                    .setTitle("XP Excluded List")
                    .setDescription("This is a list about XP Excluded in this server.")
                    .addField("❯ User", userDisplay)
                    .addField("❯ Role", roleDisplay)
                    .addField("❯ Channel", channelDisplay)
                    .addField("❯ Category", cateDisplay)
                    .setFooter(message.guild.name, message.guild.iconURL())

                message.channel.send({ embed })
                break;
            default:
                break;
        }
    }
}