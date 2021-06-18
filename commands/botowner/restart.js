const Command = require('../../structures/Command');

module.exports = class RestartCMD extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            memberName: 'restart',
            group: 'botowner',
            description: "Restart a bot",
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
        })
    }
    run(message, args) {

        message.reply("Good bye my friends");
        console.log(`${message.author.username} restart a bot`);
        setTimeout(() => {
            process.exit();
        }, 1000);
    }
}