const { Command } = require("discord.js-commando");

class ExtendedCommand extends Command {
    constructor(client, info){
        super(client, info);

        this.cooldown = info.cooldown || 0;
        this.guarded = info.guarded || false;
        this.argsSingleQuotes = info.argsSingleQuotes || false;
        this.throttling = null;
    }

    get getMemberName() {
        return this.memberName;
    }
}

module.exports = ExtendedCommand;