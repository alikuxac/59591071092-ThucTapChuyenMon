const Command = require("../../structures/Command");

module.exports = class VCSetup extends Command {
    constructor(client) {
        super(client, {
            name: "vcsetup",
            memberName: "vcsetup",
            group: "admin",
            description: "Setup auto voice system",
            guildOnly: true,
            args: [
                {
                    key: "action",
                    prompt: "What do you want to do?",
                    type: "string"
                },
                {
                    key: "value",
                    prompt: "Give me the value please",
                    type: "string",
                    default: ""
                }
            ]
        })
    }

    async run(message, { action, value }) {
        let VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");

        switch (action) {
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
                const channel = this.client.registry.types.get("text-channel").parse(value);
                if (!channel) return message.reply("invalid text channel. Please try again");

                VoiceSettings["log"] = channel.id + "";
                try {
                    await this.client.provider.setGuild(message.guild.id, "voice", VoiceSettings);
                    message.say(`Set voice log to <#${channel.id}> successfully.`);
                } catch (err) {
                    throw err;
                }
                break;

            case "limit":
                if (!value) return message.reply("invalid value");
                if (!isNaN(parseInt(value))) return message.reply("invalid number");

                VoiceSettings["limit"] = parseInt(value);
                try {
                    await this.client.provider.setGuild(message.guild.id, "voice", VoiceSettings);
                    message.say(`Set voice limit to \`${value}\` successfully.`);
                } catch (err) {
                    throw err;
                }
                break;
            default:
                break;
        }
    }
}