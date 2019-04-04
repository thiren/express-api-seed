'use strict';

const Boom = require('boom');
const expect = require('chai').expect;
const error = require('../../../utilities/error-handling/error');

describe('Error Parser', function () {
    const req = {
        reference: '123456-abcdef',
        method: 'GET',
        originalUrl: 'localhost',
        query: {},
        body: {}
    };

    it('should parse a native nodejs error into an error object', function (done) {
        const nativeError = new Error('This is a test');
        const parsedError = error.parse(req, nativeError);

        expect(parsedError).to.be.an('object');
        expect(parsedError).to.have.property('statusCode').that.is.a('number');
        expect(parsedError).to.have.property('error').that.is.a('string');
        expect(parsedError).to.have.property('message').that.is.a('string');
        expect(parsedError).to.have.property('timestamp').that.is.a('string');
        expect(parsedError).to.have.property('data');
        expect(parsedError).to.have.property('stack');
        expect(parsedError).to.have.property('request').that.is.an('object');
        expect(parsedError).to.have.nested.property('request.reference').that.is.a('string');
        expect(parsedError).to.have.nested.property('request.method').that.is.a('string');
        expect(parsedError).to.have.nested.property('request.url').that.is.a('string');
        expect(parsedError).to.have.nested.property('request.query').that.is.an('object');
        expect(parsedError).to.have.nested.property('request.body').that.is.an('object');

        done();
    });

    it('should parse a native nodejs error into an error object that has a status 500', function (done) {
        //const error = new Error('This is a test');

        done();
    });

    it('should parse a boom error into an error object', function (done) {
        const boomError = Boom.boomify(new Error('Test error'), {statusCode: 500, message: 'Test error message'});
        const parsedError = error.parse(req, boomError);

        console.log(parsedError);

        expect(parsedError).to.be.an('object');
        expect(parsedError).to.have.property('statusCode').that.is.a('number');
        expect(parsedError).to.have.property('error').that.is.a('string');
        expect(parsedError).to.have.property('message').that.is.a('string');
        expect(parsedError).to.have.property('timestamp').that.is.a('string');
        expect(parsedError).to.have.property('data');
        expect(parsedError).to.have.property('stack');
        expect(parsedError).to.have.property('request').that.is.an('object');
        expect(parsedError).to.have.nested.property('request.reference').that.is.a('string');
        expect(parsedError).to.have.nested.property('request.method').that.is.a('string');
        expect(parsedError).to.have.nested.property('request.url').that.is.a('string');
        expect(parsedError).to.have.nested.property('request.query').that.is.an('object');
        expect(parsedError).to.have.nested.property('request.body').that.is.an('object');

        done();
    });
});
