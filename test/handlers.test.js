const assert = require('assert');
const sinon = require('sinon');
const { isAuthenticated } = require('../handlers');
const enums = require('../enums');
const returnMessage = require('../returnMessage');

describe('#handlers #isAuthenticated', function () {
    it('next function should be called.', function () {
        const req = {
            isAuthenticated: () => true,
        }
        const next = sinon.fake();

        isAuthenticated(req, null, next);

        assert.strictEqual(next.callCount, 1);
    });
});

describe('#handlers #isAuthenticated', function () {
    it('next function should not be called.', function () {
        const req = {
            isAuthenticated: () => false,
        }
        const next = sinon.fake();
        const res = {
            status: () => ({
                json: () => { }
            })
        }

        isAuthenticated(req, res, next);
        assert.strictEqual(next.callCount, 0);
    });
});

describe('#handlers #isAuthenticated', function () {
    it('status should be called with 403', function () {
        const req = {
            isAuthenticated: () => false,
        }
        const next = sinon.fake();

        const jsonFn = sinon.fake();
        const res = {
            status: sinon.fake(() => ({
                json: jsonFn
            }))
        }

        isAuthenticated(req, res, next);
        assert(res.status.calledOnceWithExactly(403));
    });
});

describe('#handlers #isAuthenticated', function () {
    it('status should be called with 403', function () {
        const req = {
            isAuthenticated: () => false,
        }
        const next = sinon.fake();

        const jsonFn = sinon.fake();
        const res = {
            status: sinon.fake(() => ({
                json: jsonFn
            }))
        }

        isAuthenticated(req, res, next);
        assert(jsonFn.calledOnceWithExactly(returnMessage({
            status: false,
            message: enums.notAuthorized
        })));
    });
});