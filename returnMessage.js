const enums = require('./enums');

module.exports = ({
    status = false,
    message = enums.notAuthorized,
    code = 403,
    data = null
} = {
        status: false,
        message: enums.notAuthorized,
        code: 403,
        data: null
    }) => ({
        status,
        message,
        code,
        data
    })