
module.exports = async (client, oldState, newState) => {
    if (!client.provider.isReady) return;
    //Ignore bot
    if (oldState.member.user.bot || newState.member.user.bot) return;

    // User join voice
    if (!oldState.channel && newState.channel) {
        require("../handlers/voice/UserJoinVoice")(client, newState);
    }

    // User left voice
    if (oldState.channel && !newState.channel) {
        require("../handlers/voice/UserLeftVoice")(client, oldState);
    }

    // User change voice channel
    if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        require("../handlers/voice/UserChangeVoice")(client, oldState, newState);
    }
}