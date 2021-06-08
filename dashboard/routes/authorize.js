const authorizeRoute = require('express').Router();
const FormData = require('form-data');
const fetch = require("node-fetch");
const forceAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/authorize')
    else return next();
}
const scopes = ["identify", "guilds"];

authorizeRoute.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/');

    const authorizeUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CALLBACK_URL)}&response_type=code&scope=identify%20guilds`;
    res.redirect(authorizeUrl);
});

authorizeRoute.get('/callback', (req, res) => {
    if (req.session.user) return res.redirect('/');

    const accessCode = req.query.code;
    if (!accessCode) throw new Error('No access code returned from Discord');

    const data = new FormData();
    data.append('client_id', process.env.CLIENT_ID);
    data.append('client_secret', process.env.CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', process.env.CALLBACK_URL);
    data.append('scope', scopes.join(' '));
    data.append('code', accessCode);

    fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: data
    })
        .then(res => res.json())
        .then(response => {

            fetch('https://discordapp.com/api/users/@me', {
                method: 'GET',
                headers: {
                    authorization: `${response.token_type} ${response.access_token}`
                },
            })
                .then(res1 => res1.json())
                .then(userResponse => {

                    userResponse.tag = `${userResponse.username}#${userResponse.discriminator}`;
                    userResponse.avatarURL = userResponse.avatar ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png?` : null;
                    req.session.user = userResponse;

                });
            fetch('https://discordapp.com/api/users/@me/guilds', {
                method: 'GET',
                headers: {
                    authorization: `${response.token_type} ${response.access_token}`
                },
            })
                .then(res2 => res2.json())
                .then(gResponse => {

                    req.session.guilds = gResponse.data;
                    res.redirect('/manage');
                });
        });
})

authorizeRoute.get('/logout', forceAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.render('error', { pageTitle: 'Error', Message: 'Error while logging out' });
    });
    res.redirect('/')
});

module.exports = authorizeRoute;