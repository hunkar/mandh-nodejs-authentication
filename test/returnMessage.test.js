const assert = require('assert');
const sinon = require('sinon');
const returnMessage = require('../returnMessage');
const enums = require('../enums');

describe('#returnMessage #emptyObject', function () {
    it('Result should be equal to mock data.', function () {
        const mockResponse = {
            status: false,
            message: enums.notAuthorized,
            code: 403,
            data: null
        }

        assert.deepStrictEqual(mockResponse, returnMessage());
    });
});

describe('#returnMessage #emptyObject', function () {
    it('Result should be not equal to mock data.', function () {
        const mockResponse = {
            status: false,
            message: enums.notAuthorized,
            code: 402,
            data: null
        }

        assert.notDeepStrictEqual(mockResponse, returnMessage());
    });
});

describe('#returnMessage #withFullObject', function () {
    it('Result should be not equal to mock data.', function () {
        const mockResponse = {
            status: false,
            message: enums.notAuthorized,
            code: 403,
            data: null
        }

        const sendObject = {
            status: true,
            code: 200,
            message: enums.loginSuccess,
            data: 1
        }

        assert.notDeepStrictEqual(mockResponse, returnMessage(sendObject));
    });
});

describe('#returnMessage #withHalfObject', function () {
    it('Result should be equal to mock data.', function () {
        const mockResponse = {
            status: true,
            message: enums.notAuthorized,
            code: 200,
            data: null
        }

        const sendObject = {
            status: true,
            code: 200,
        }

        assert.deepStrictEqual(mockResponse, returnMessage(sendObject));
    });
});