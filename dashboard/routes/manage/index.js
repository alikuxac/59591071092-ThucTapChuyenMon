const manage_route = require('express').Router();

manage_route.use((req, res, next) => {
    if (!req.session.user) return res.redirect('/authorize')
    else return next();
});

manage_route.get("/", (req, res, next) => {
    res.render('manage', { pageTitle: 'Dashboard', user: req.session.user || null });
})



module.exports = manage_route;