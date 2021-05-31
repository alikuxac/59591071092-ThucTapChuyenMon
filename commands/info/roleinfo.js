const Discord = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class RoleInfoCMD extends Command {
    constructor(client) {
        super(client, {
            name: "roleinfo",
            group: "info",
            memberName: "roleinfo",
            description: "Show specific role information.",
            userPermissions: ["SEND_MESSAGES"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            guildOnly: true,
            args: [
                {
                    key: "role",
                    prompt: "What role do you want to check",
                    type: "role"
                }
            ]
        })
    }
    async run(message, { role }) {

        let permdisc = "";
        let bot = message.guild.me;
        let managed = role.managed ? "Yes" : "No";
        let hoist = role.hoist ? "Yes" : "No";
        let mention = role.mentionable ? "Yes" : "No";

        permdisc = role.permissions.bitfield == 0 ? "None" : role.permissions.toArray().join(", ");
        const embed = new Discord.MessageEmbed()
            .setTitle(`Info of ${role.name}`)
            .addFields(
                { name: "❯ Managed", value: managed, inline: true },
                { name: "❯ Mentionable", value: mention, inline: true },
                { name: "❯ Hoist", value: hoist, inline: true },
                { name: "❯ ID", value: role.id },
                { name: "❯ Position", value: role.position },
                { name: (`❯ Permissions [${role.permissions.bitfield}]`), value: permdisc }
            )
            .setFooter(`Created at `)
            .setTimestamp(role.createdTimestamp)
            .setColor(bot.displayHexColor);
        message.channel.send(embed);
    }
};