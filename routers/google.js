const passport = require('passport');
const googleRouter = require("express-async-router").AsyncRouter();

const config = require("../config");

googleRouter.get('/login', passport.authenticate('google', { scope: config.googleScopes }));

googleRouter.get('/callback',
    passport.authenticate('google', {
        failureRedirect: config.googleRouterName + '/login'
    }),
    function (req, res) {
        res.redirect('/');
    });

module.exports = {
    googleRouter
}