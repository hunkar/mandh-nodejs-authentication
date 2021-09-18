const passport = require('passport');
const nodeMailer = require('nodemailer');
const userRouter = require("express-async-router").AsyncRouter({ send: false });
const config = require("../config").config;
const enums = require("../enums");
const { generateActivationToken, BcryptHasher } = require("mandh-nodejs-utils").cryptoUtil;
const returnMessage = require("../returnMessage");

userRouter.post('/login', async (req, res, next) => {
    passport.authenticate('local',
        function (err, user, info) {
            if (user) {
                req.login(user, function (error) {
                    if (error) {
                        res.status(403).json(returnMessage({
                            status: false,
                            message: err || (info && info.message)
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

userRouter.post('/register', async (req, res, next) => {
    const user = await config.getUserByUniqueField(req.body);

    if (user) {
        res.status(403).json(returnMessage({
            status: false,
            message: enums.userExist
        }));
    } else if (req.body.password !== req.body.passwordConfirm) {
        res.status(403).json(returnMessage({
            status: false,
            message: enums.wrongPasswordConfirm,
        }));
    } else {
        const userObject = { ...req.body };

        delete userObject.passwordConfirm;
        userObject.password = new BcryptHasher().getHash(userObject.password);

        userObject.customData = {
            userConfirmationToken: generateActivationToken(),
            confirmed: false,
        }

        const createdUser = await config.createUser(userObject);

        if (config.emailConfirm && config.emailConfiguration) {
            let transporter = nodeMailer.createTransport({
                service: config.emailConfiguration.service || 'Yandex',
                auth: {
                    user: config.emailConfiguration.user,
                    pass: config.emailConfiguration.password
                },
            });

            await transporter.sendMail({
                from: `"${config.emailConfiguration.emailName}" <${config.emailConfiguration.user}>`,
                to: userObject.email,
                subject: "User Registration",
                html: `<a href="${config.host}/${config.userRouterName}/confirmation?cto=${userObject.customData.userConfirmationToken}">Please click here for confirm your registration</a>`,
            });

            res.status(200).send(returnMessage({
                status: true,
                message: enums.confirmationSent,
                code: 200
            }));
        } else if (createdUser) {
            await config.setUserConfirmed(createdUser.id);

            res.status(200).send(returnMessage({
                status: true,
                message: enums.addSuccess,
                code: 200,
                data: {
                    redirect: `/${config.userRouterName}/login`,
                }
            }));
        } else {
            res.status(500).json(returnMessage({
                status: false,
                message: enums.errorOccured,
                code: 500,
            }));
        }
    }
});

userRouter.get('/logout', async (req, res) => {
    req.logout();
    res.status(200).send(returnMessage({
        status: true,
        message: enums.logoutSuccess,
        data: {
            redirect: `/${config.userRouterName}/login`,
        },
    }));
});

userRouter.get('/confirmation', async (req, res, next) => {
    const user = await config.getUserByUniqueField("confirmationToken", req.query.cto);

    if (!user) {
        res.status(403).json(returnMessage({
            status: false,
            message: enums.userNotFound
        }));
    } else {
        const result = await config.setUserConfirmed(user.id);

        if (result) {
            res.status(200).send(returnMessage({
                status: true,
                message: enums.userConfirmed,
                code: 200,
                data: {
                    redirect: `/${config.userRouterName}/login`,
                },
            }));
        } else {
            res.status(500).json(returnMessage({
                status: false,
                message: enums.errorOccured,
                code: 500,
                data: {
                    redirect: `/${config.userRouterName}/login`,
                }
            }));
        }
    }
});

userRouter.post('/changepassword', async (req, res, next) => {
    const user = await config.getUserById(req.query.id);
    const bcryptHelper = new BcryptHasher();

    if (!user) {
        res.status(403).json(returnMessage({
            status: false,
            message: enums.userNotFound,
        }));
    } else if (
        !req.body.password
        || !req.body.newPassword
        || !req.body.newPasswordConfirm
        || req.body.newPassword !== req.body.newPasswordConfirm
        || !bcryptHelper.compare(req.body.password, user.password)
    ) {
        res.status(403).json(returnMessage({
            status: false,
            message: enums.wrongPasswordConfirm,
        }));
    } else {
        const result = await config.setUserPassword(bcryptHelper.getHash(req.body.newPassword));

        if (result) {
            res.status(200).send(returnMessage({
                status: true,
                message: enums.passwordChanged,
                code: 200
            }));
        } else {
            res.status(500).json(returnMessage({
                status: false,
                message: enums.errorOccured,
                code: 500,
            }));
        }
    }
})

module.exports = {
    userRouter
}