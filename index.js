const config = require('./config');
const passport = require('./passport');
const userRouters = require('./routers/user');
const googleRouters = require('./routers/google');
const handlers = require('./handlers');

module.exports = {
    routers: {
        user: userRouters,
        google: googleRouters
    },
    initialize: {
        ...passport
    },
    config: {
        ...config
    },
    handlers: {
        ...handlers
    }
}