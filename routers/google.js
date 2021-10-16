const passport = require('passport');
const googleRouter = require("express-async-router").AsyncRouter({ send: false });
const { OAuth2Client } = require('google-auth-library');

const { config } = require("../config");
const returnMessage = require("../returnMessage");
const enums = require("../enums");

googleRouter.get('/login', passport.authenticate('google', { scope: config.googleScopes }));

googleRouter.get('/callback', function (req, res, next) {
    passport.authenticate('google',
        function (err, user, info) {
            if (user) {
                req.login(user, function (error) {
                    if (error) {
                        res.status(403).json(returnMessage({
                            status: false,
                            message: error || (error && error.message)
                        }))
                    } else {
                        res.status(200).json(returnMessage({
                            status: true,
                            message: enums.loginSuccess,
                            code: 200,
                            data: {
                                user
                            }
                        }))
                    }
                });
            } else {
                res.status(403).json(returnMessage({
                    status: false,
                    message: err || (info && info.message)
                }))
            }

        }
    )(req, res, next)
});

googleRouter.get('/logout', async (req, res) => {
    req.logout();
    res.status(200).send(returnMessage({
        status: true,
        message: enums.logoutSuccess,
        data: {
            redirect: `/${config.userRouterName}/login`,
        },
    }));
});

googleRouter.post('/loginformobile', async (req, res) => {
    const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: config.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];

    if (userId) {
        let user = await config.getOrInsertUserByGoogleId({
            googleId: userId,
            accessToken: req.body.token,
            profile: {
                name: req.body.name,
                surname: req.body.surname,
                userName: req.body.userName,
                email: req.body.email,
                profileImageUrl: req.body.profileImageUrl,
            }
        });
        user = user && user.toJSON();

        if (user) {
            req.login(user, function (error) {
                if (error) {
                    res.status(403).json(returnMessage({
                        status: false,
                        message: error || (error && error.message)
                    }))
                } else {
                    res.status(200).json(returnMessage({
                        status: true,
                        message: enums.loginSuccess,
                        code: 200,
                        data: {
                            user
                        }
                    }))
                }
            });

            return;
        }
    }

    res.status(403).json(returnMessage({
        status: false,
    }))
});

module.exports = {
    googleRouter
}