const manage_route = require('express').Router();

manage_route.use((req, res, next) => {
    if (!req.session.user) return res.redirect('/authorize')
    next();
});

manage_route.get("/", (req, res, next) => {
    res.render('manage', { pageTitle: 'Dashboard', user: req.session.user, dclient: req.client, req });
})
manage_route.use("/:id", (req, res, next) => {
    const serverID = req.params.id;
    const guild = req.client.guilds.cache.get(serverID);
    if (!guild) return res.redirect("/manage");
    req.serverID = serverID;
    req.guild = guild;
    next()
})
manage_route.get("/:id", (req, res, next) => {
    const serverID = req.serverID
    const guild = req.client.guilds.cache.get(req.serverID);
    const prefix = req.client.provider.getGuild(serverID, "prefix", process.env.PREFIX)
    return res.render('manage/main', { pageTitle: "Dashboard", serverID, user: req.user, guild: req.guild, dclient: req.client, prefix });
})
manage_route.post("/:id", async (req, res, next) => {
    const serverID = req.serverID
    await req.client.provider.setGuild(serverID, "prefix", req.body.prefix);
    req.guild.commandPrefix = req.body.prefix;
    return res.render('manage/main', { pageTitle: "Dashboard", serverID, user: req.user, guild: req.guild, dclient: req.client, prefix: req.body.prefix });
})

manage_route.get("/:id/voice", (req, res, next) => {
    const serverID = req.serverID;
    const voiceSettings = req.client.provider.getGuild(serverID, "voice");
    return res.render('manage/voice', { pageTitle: "Dashboard", serverID, user: req.user, guild, req: req, settings: voiceSettings });
})

manage_route.post("/:id/voice", (req, res, next) => {
    const serverID = req.serverID;
    const { status, limit, log } = req.body;
    const statusValue = status ? true : false;
    const data = {
        status: statusValue,
        limit: Number(limit),
        log
    }
    await req.client.provider.setGuild(serverID, "voice", data);
    return res.render('manage/voice', { pageTitle: "Dashboard", serverID, user: req.user, guild: req.guild, req: req, settings: req.body });
})
module.exports = manage_route;