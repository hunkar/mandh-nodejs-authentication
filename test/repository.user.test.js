const assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('#user #getModel', function () {
    it('getModel should be called', function () {
        const getModel = sinon.fake(() => ({
            findByField: () => { }
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        userRouter.getUserByEmail('email@email.com');
        assert.strictEqual(getModel.callCount, 2);
    });
});

describe('#user #getUserByEmail', function () {
    it('getUserByEmail should be called', function () {
        const findByField = sinon.fake();

        const getModel = sinon.fake(() => ({
            findByField
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        userRouter.getUserByEmail('email@email.com');
        assert(findByField.calledWithExactly('email', 'email@email.com'));
    });

    it('getUserByEmail should return mock result', async function () {
        const mockResult = {
            email: 'email@email.com',
            id: 3
        };

        const findByField = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            findByField
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getUserByEmail('email@email.com');
        assert.deepStrictEqual(result, mockResult);
    });


    it('getUserByEmail should return null and not call findByField', async function () {
        const mockResult = {
            email: 'email@email.com',
            id: 3
        };

        const findByField = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => null);

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getUserByEmail('email@email.com');
        assert.deepStrictEqual(findByField.callCount, 0);
        assert.deepStrictEqual(getModel.callCount, 1);
        assert.deepStrictEqual(result, null);
    });
});

describe('#user #getUserById', function () {
    it('getUserById should be called', function () {
        const findById = sinon.fake();

        const getModel = sinon.fake(() => ({
            findById
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        userRouter.getUserById('12345');
        assert(findById.calledWithExactly('12345'));
    });

    it('getUserById should return mock result', async function () {
        const mockResult = {
            email: 'email@email.com',
            id: 3
        };

        const findById = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            findById
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getUserById('12345');
        assert.deepStrictEqual(result, mockResult);
    });


    it('getUserByEmail should return null and not call findById', async function () {
        const mockResult = {
            email: 'email@email.com',
            id: 3
        };

        const findById = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => null);

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getUserById('12345');
        assert.deepStrictEqual(findById.callCount, 0);
        assert.deepStrictEqual(getModel.callCount, 1);
        assert.deepStrictEqual(result, null);
    });
});

describe('#user #getUserByGoogleId', function () {
    it('getUserByGoogleId should be called', function () {
        const findByField = sinon.fake();

        const getModel = sinon.fake(() => ({
            findByField
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        userRouter.getUserByGoogleId('123456');
        assert(findByField.calledWithExactly('customData.googleId', '123456'));
    });

    it('getUserByGoogleId should return mock result', async function () {
        const mockResult = {
            email: 'email@email.com',
            id: 3
        };

        const findByField = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            findByField
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getUserByGoogleId('customData.googleId', '123456');
        assert.deepStrictEqual(result, mockResult);
    });


    it('getUserByGoogleId should return null and not call findByField', async function () {
        const mockResult = {
            email: 'email@email.com',
            id: 3
        };

        const findByField = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => null);

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getUserByGoogleId('customData.googleId', '123456');
        assert.deepStrictEqual(findByField.callCount, 0);
        assert.deepStrictEqual(getModel.callCount, 1);
        assert.deepStrictEqual(result, null);
    });
});

describe('#user #getOrInsertUserByGoogleId', function () {
    it('getOrInsertUserByGoogleId should be called with existing user', async function () {
        const mockUser = {
            id: 1,
            name: 'user.name',
            email: 'email@email.com',
        };

        const mockProfile = {
            googleId: '1234',
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            profile: {
                name: 'name',
            }
        };

        const findByField = sinon.fake(() => new Promise(res => { res(mockUser) }));

        const getModel = sinon.fake(() => ({
            findByField,
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getOrInsertUserByGoogleId(mockProfile);

        assert.strictEqual(getModel.callCount, 2);
        assert.strictEqual(result, mockUser);
        assert(findByField.calledOnceWithExactly('customData.googleId', mockProfile.googleId));
    });

    it('getOrInsertUserByGoogleId should be called with not exist user.', async function () {
        const mockProfile = {
            googleId: '1234',
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            profile: {
                name: 'name',
            }
        };

        const mockUserData = {
            ...mockProfile.profile,
            sso: true,
            customData: {
                googleId: mockProfile.googleId,
                accessToken: mockProfile.accessToken,
                refreshToken: mockProfile.refreshToken,
                confirmed: true,
            }
        };

        const findByField = sinon.fake(() => new Promise(res => { res(null) }));
        const create = sinon.fake(() => new Promise(res => { res(mockUserData) }));

        const getModel = sinon.fake(() => ({
            findByField,
            create,
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getOrInsertUserByGoogleId(mockProfile);

        assert.strictEqual(findByField.callCount, 1);
        assert.strictEqual(create.callCount, 1);
        assert.strictEqual(getModel.callCount, 4);
        assert.strictEqual(result, mockUserData);
        assert(findByField.calledOnceWithExactly('customData.googleId', mockProfile.googleId));
        assert(create.calledOnceWithExactly(mockUserData));
    });
});

describe('#user #getUserByUniqueField', function () {
    it('getUserByUniqueField, getModel and findByField should be called', function () {
        const findByField = sinon.fake();

        const getModel = sinon.fake(() => ({
            findByField
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        userRouter.getUserByUniqueField('email', 'email@email.com');
        assert(findByField.calledWithExactly('email', 'email@email.com'));
        assert.strictEqual(getModel.callCount, 2);
    });

    it('getUserByUniqueField should return mock result', async function () {
        const mockResult = {
            email: 'email@email.com',
            id: 3
        };

        const findByField = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            findByField
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getUserByEmail('email@email.com');
        assert.deepStrictEqual(result, mockResult);
        assert.deepStrictEqual(findByField.callCount, 1);
        assert.deepStrictEqual(getModel.callCount, 2);
    });


    it('getUserByUniqueField should return null and not call findByField', async function () {
        const mockResult = {
            email: 'email@email.com',
            id: 3
        };

        const findByField = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => null);

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.getUserByEmail('email@email.com');
        assert.deepStrictEqual(findByField.callCount, 0);
        assert.deepStrictEqual(getModel.callCount, 1);
        assert.deepStrictEqual(result, null);
    });
});

describe('#user #createUser', function () {
    it('createUser, getModel and create should be called, result should be mock result', async function () {
        const mockData = {
            id: 1,
            email: 'email@email.com',
            confirmed: true,
        };
        const mockResult = {
            id: 1,
            email: 'email@email.com',
            confirmed: false,
        }

        const create = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            create
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.createUser(mockData);

        assert(create.calledWithExactly(mockResult));
        assert.deepStrictEqual(result, mockResult);
        assert.strictEqual(getModel.callCount, 2);
        assert.strictEqual(create.callCount, 1);
    });

    it('createUser, getModel and create should not be called, result should be null', async function () {
        const create = sinon.fake(() => new Promise(res => res({
            id: 1,
            email: 'email@email.com'
        })));

        const getModel = sinon.fake(() => ({
            create
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.createUser();
        assert.deepStrictEqual(result, null);
        assert.deepStrictEqual(create.callCount, 0);
        assert.deepStrictEqual(getModel.callCount, 0);
    });
});

describe('#user #setUserConfirmed', function () {
    it('setUserConfirmed, getModel and updateById should be called', async function () {
        const id = 1;
        const mockResult = {
            nModified: 1,
        };

        const updateById = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            updateById
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.setUserConfirmed(id);

        assert(updateById.calledWithExactly(id, {
            'customData.confirmed': true
        }));
        assert.deepStrictEqual(result, mockResult);
        assert.strictEqual(getModel.callCount, 2);
        assert.strictEqual(updateById.callCount, 1);
    });

    it('setUserConfirmed, getModel and updateById should not be called', async function () {
        const mockResult = {
            nModified: 1,
        };

        const updateById = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            updateById
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.setUserConfirmed();

        assert.deepStrictEqual(result, null);
        assert.strictEqual(getModel.callCount, 0);
        assert.strictEqual(updateById.callCount, 0);
    });
});

describe('#user #setUserPassword', function () {
    it('setUserPassword, getModel and updateById should be called', async function () {
        const id = 1;
        const password = '123';
        const mockResult = {
            nModified: 1,
        };

        const updateById = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            updateById
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.setUserPassword(id, password);

        assert(updateById.calledWithExactly(id, {
            password
        }));
        assert.deepStrictEqual(result, mockResult);
        assert.strictEqual(getModel.callCount, 2);
        assert.strictEqual(updateById.callCount, 1);
    });

    it('setUserPassword, getModel and updateById should not be called', async function () {
        const mockResult = {
            nModified: 1,
        };

        const updateById = sinon.fake(() => new Promise(res => res(mockResult)));

        const getModel = sinon.fake(() => ({
            updateById
        }));

        const userRouter = proxyquire('../repository/user.js', {
            './models/user': {
                getModel
            }
        });

        const result = await userRouter.setUserPassword();

        assert.deepStrictEqual(result, null);
        assert.strictEqual(getModel.callCount, 0);
        assert.strictEqual(updateById.callCount, 0);
    });
});