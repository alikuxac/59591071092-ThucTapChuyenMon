const index_route = require("express").Router();

index_route.get("/github", (req, res) => { 
    res.redirect("https://github.com/alikuxac");
})
index_route.get("/info", (req, res) => { 
    res.redirect("https://status.alikuxac.me");
})
index_route.get("/status", (req, res) => { 
    res.redirect("https://status.alikuxac.me");
})
index_route.get("/discord", function (req, res) {
    res.redirect(`${process.env.INVITE}`);
})
index_route.use('/manage', require('./manage'))
index_route.use("/authorize", require("./authorize"));
index_route.get("/invite", (req, res) => {
    res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}6&permissions=8&scope=bot+applications.commandsresponse_type=code&redirect_uri=${process.env.CALLBACK_URL}`)
})


index_route.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'Home', user: req.session.user || null, servers: req.client.guilds.cache.size, users: req.client.users.cache.size, client: req.client });
})

module.exports = index_route;