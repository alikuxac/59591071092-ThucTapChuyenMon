const Command = require("../../structures/Command");
const { stripIndents, oneLine } = require('common-tags');

module.exports = class PrefixCMD extends Command {
    constructor(client) {
        super(client, {
            name: "prefix",
            memberName: "prefix",
            group: "admin",
            description: "Changes the prefix of the server or shows you the current prefix if you just use this command",
            guildOnly: true,
            args: [
                {
                    key: "prefix",
                    prompt: "",
                    type: "string",
                    max: 8,
                    min: 1,
                    default: "",
                    parse: prefix => prefix.toLowerCase()
                }
            ]
        })
    }
    async run(message, { prefix }) {
        if (!prefix) {
            const currentPrefix = message.guild ? message.guild.commandPrefix : this.client.commandPrefix;
            return message.reply(stripIndents`
				${currentPrefix ? `The command prefix is \`${currentPrefix}\`.` : 'There is no command prefix.'}
				To run commands, use ${message.anyUsage('command')}.
			`);
        }

        if (message.guild) {
            if (!message.member.permissions.has('ADMINISTRATOR') && !this.client.isOwner(message.author)) {
                return message.reply('Only administrators may change the command prefix.');
            }
        } 

        if (prefix.split(" ").length > 0) return message.reply('your new prefix cannot have spaces!');
        await this.client.provider.setGuild(message.guild.id, 'prefix', prefix);

        message.guild.commandPrefix = prefix;
        return message.channel.send(`The prefix has been changed to ${prefix}`);
    }
}