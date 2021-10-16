const { getModel } = require('./models/user');

const getUserByEmail = async (email) => {
    return getModel() && await getModel().findByField('email', email);
}

const getUserById = async (id) => {
    return getModel() && await getModel().findById(id);
}

const getUserByGoogleId = async (id) => {
    return getModel() && await getModel().findByField('customData.googleId', id);
}

const getOrInsertUserByGoogleId = async ({ googleId, accessToken, refreshToken, profile }) => {
    const user = await getUserByGoogleId(googleId);

    if (user) return user;

    return getModel() && await getModel().create({
        ...profile,
        sso: true,
        customData: {
            googleId,
            accessToken,
            refreshToken,
            confirmed: true,
        }
    });
}

const getUserByUniqueField = async (field, value) => {
    return getModel() && await getModel().findByField(field, value);
}

const createUser = async (user = null) => {
    return user && getModel() && await getModel().create({
        ...user,
        confirmed: false,
    });
}

const setUserConfirmed = async (id = null) => {
    return id && getModel() && await getModel().updateById(id, {
        'customData.confirmed': true,
    });
}

const setUserPassword = async (id = null, password = null) => {
    return id && password && getModel() && await getModel().updateById(id, {
        'password': password,
    });
}

module.exports = {
    getUserByEmail,
    getUserById,
    getUserByGoogleId,
    getOrInsertUserByGoogleId,
    getUserByUniqueField,
    createUser,
    setUserConfirmed,
    setUserPassword,
}