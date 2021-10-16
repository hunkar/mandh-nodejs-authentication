const enums = require('./enums');
const userRepo = require('./repository/user');

const config = {
    getUserByEmail: userRepo.getUserByEmail,
    getUserById: userRepo.getUserById,
    getOrInsertUserByGoogleId: userRepo.getOrInsertUserByGoogleId,
    getUserByGoogleId: userRepo.getUserByGoogleId,
    getUserByUniqueField: userRepo.getUserByUniqueField,
    createUser: userRepo.createUser,
    setUserConfirmed: userRepo.setUserConfirmed,
    setUserPassword: userRepo.setUserPassword,
    emailConfirm: false,
    emailConfiguration: null,
    usernameField: enums.defaultUsernameField,
    passwordField: enums.defaultPasswordField,
    dbName: enums.defaultDbName,
    connectionString: '',
    sessionSecret: 'secretKeyHere',
    host: 'http://www.example.com.tr',
    userRouterName: 'user',
    googleRouterName: 'google',
    GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
    GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
    googleScopes: ['https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile']
}

const setConfig = (configValues) => {
    configValues = configValues || {};

    Object.keys(configValues).forEach((key) => {
        if (configValues[key] !== undefined)
            config[key] = configValues[key];
    })
}

module.exports = {
    config,
    setConfig
};