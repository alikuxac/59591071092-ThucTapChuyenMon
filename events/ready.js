module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag} - ${client.user.id}!`);
    console.log(`Loaded ${client.registry.commands.size} comamnds, ${client.events.size} events`);
    client.user.setActivity(`my server.`, { type: "WATCHING" })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);

}