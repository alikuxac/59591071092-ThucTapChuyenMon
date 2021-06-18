const Command = require("../../structures/Command");
const exec = require("child_process").exec;
const Discord = require("discord.js");

module.exports = class ExecCMD extends Command {
    constructor(client) {
        super(client, {
            name: "exec",
            memberName: "exec",
            group: "botowner",
            description: "Exec something",
            ownerOnly: true,
            args: [
                {
                    key: "input",
                    prompt: "What do you want to exec?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, { input }) {
        exec(input, (error, stdout) => {

            let response = (error || stdout);

            if (response.length > 1024) console.log(response), response = 'Output too long.';

            message.channel.send("", {
                embed: new Discord.MessageEmbed()
                    .setDescription("```" + response + "```")
                    .setTimestamp()
                    .setColor("RANDOM")
            })

        });
    }
}