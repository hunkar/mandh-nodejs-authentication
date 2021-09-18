const assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();

describe('#user #getModel', function () {
    it('getModel should return null', function () {
        const userModel = proxyquire('../repository/models/user.js', {
            'MandhDbModel': function () { return {}; },
            'getId': () => '123',
        });

        assert.strictEqual(userModel.getModel(), null);
    });
});

describe('#user #getModel', function () {
    it('getModel should return object', function () {
        const userModel = proxyquire('../repository/models/user.js', {
            'mandh-mongoose-adapter': {
                'mongoose': {
                    'MandhDbModel': function () { return {}; },
                    'getId': () => '123',
                },
            },
        });

        userModel.initModel('Mandh');
        assert.strictEqual(typeof userModel.getModel(), 'object');
    });
});