const admin_route = require("express").Router();

admin_route.use(checkAuth);

admin_route.get("/", (req, res, next) => {
    res.render("admin", {pageTitle: "Admin", dclient: req.client,  user: req.session.user, req } )
})

module.exports = admin_route;

/*
 * Authorization check, if not authorized return them to the login page.
 */
function checkAuth(req, res, next) {
    if (req.user) {
        let allowed = req.client.owners

        if (allowed.find(ele => ele.id === req.user.id)) {
            return next();
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("/authorize");
    }
}