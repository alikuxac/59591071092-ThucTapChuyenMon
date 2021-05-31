const { FriendlyError } = require("discord.js-commando");

module.exports = (client, cmd, err) => {
    if (err instanceof FriendlyError) return;
    client.logger.error(`Error in command ${cmd.groupID}: ${cmd.memberName}`, err);
}