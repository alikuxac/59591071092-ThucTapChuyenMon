const index_route = require("express").Router();

index_route.get("/discord", function (req, res) {
    res.redirect("https://discord.gg/8yfv46W");
})

index_route.use('/manage', require('./manage'))
index_route.use("/authorize", require("./authorize"));

index_route.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'Home', user: req.session.user || null, servers: req.client.guilds.cache.size , users: req.client.users.cache.size });
})

module.exports = index_route;