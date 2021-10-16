const { BcryptHasher } = require('mandh-nodejs-utils').cryptoUtil;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const enums = require("./enums");
const config = require("./config").config;
const initializeMongoDB = require('./repository').initialize;
const session = require('express-session');

const initializeDb = () => {
    if (config.connectionString) {
        initializeMongoDB(config.connectionString, config.dbName);
    }
}

const initializePassportForUser = (app) => {
    initializeDb();

    const authenticateUser = async function (email, password, done) {
        let user = await config.getUserByEmail(email);
        user = user && user.toJSON();

        if (!user) {
            done(null, false, { message: enums.userNotFound });
            return;
        }

        const result = new BcryptHasher().compare(password, user.password);

        if (result) {
            delete user.password;
            done(null, user);
            return;
        } else {
            done(null, false, { message: enums.wrongPassword });
            return;
        }
    }

    passport.use(new LocalStrategy({ usernameField: config.usernameField, passwordField: config.passwordField, }, authenticateUser))
    passport.serializeUser((user, done) => {
        done(null, user.id);
        return;
    });
    passport.deserializeUser(async (id, done) => {
        let user = await config.getUserById(id);
        user = user && user.toJSON();

        delete user.password;

        done(null, user);
        return;
    })

    app.use(session({
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session())
}

const initializePassportForGoogle = (app) => {
    initializeDb();

    const authenticateUserForGoogle = async function (accessToken, refreshToken, profile, done) {
        let user = profile && profile._json && profile._json.email && await config.getOrInsertUserByGoogleId({
            googleId: profile.id, accessToken, refreshToken, profile: {
                name: profile._json.given_name,
                surname: profile._json.family_name,
                userName: profile._json.email.split('@')[0],
                email: profile._json.email,
                profileImageUrl: profile._json.picture,
            }
        });
        user = user && user.toJSON();


        if (!user || user.err) {
            done(user, null);
        }
        else {
            delete user.password;
            done(null, user);
        }
    }

    passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: [config.host, config.googleRouterName, 'callback'].join('/')
    }, authenticateUserForGoogle));

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        let user = await config.getUserById(id);
        user = user && user.toJSON();

        delete (user && user.password);

        done(null, user);
        return;
    })

    app.use(session({
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session())
}

module.exports = {
    initializePassportForUser,
    initializePassportForGoogle
}