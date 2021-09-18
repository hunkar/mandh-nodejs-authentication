const { MandhDbModel, getId } = require('mandh-mongoose-adapter').mongoose;
const { commonFields } = require('./common');

let userModel = null;

const initModel = (dbName) => {
    userModel = new MandhDbModel({
        id: {
            type: String,
            default: () => getId(),
        },
        name: {
            type: String,
        },
        surname: {
            type: String,
        },
        userName: {
            type: String,
        },
        email: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        profileImageUrl: {
            type: String
        },
        birthday: {
            type: String
        },
        sso: {
            type: String,
            default: () => false
        },
        password: {
            type: String
        },
        ...commonFields,
    }, "MandhUser", dbName);
}

const getModel = () => userModel;

module.exports = {
    initModel,
    getModel,
}