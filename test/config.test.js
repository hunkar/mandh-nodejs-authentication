const assert = require('assert');
const { config, setConfig } = require('../config');

describe('#config #getConfig', function () {
    it('emailConfirm should be equal false.', function () {
        assert.strictEqual(false, config.emailConfirm);
    });
});

describe('#config #setConfig', function () {
    it('emailConfirm item should be set true.', function () {
        setConfig({
            emailConfirm: true,
        })

        assert.strictEqual(true, config.emailConfirm);
    });
});