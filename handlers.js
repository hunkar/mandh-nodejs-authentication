const enums = require('./enums');
const returnMessage = require('./returnMessage');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json(
            returnMessage({
                status: false,
                message: enums.notAuthorized
            })
        )
    }
}

module.exports = {
    isAuthenticated
}