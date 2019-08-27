'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app');

describe('Invalid routes', function () {
    it('should return a 404 response', function (done) {
        request(app)
            .get('/an-invalid-route')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('statusCode');
                expect(res.body.statusCode).to.equal(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.equal('Not Found');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('Route not found');

                return done();
            });
    });

    it('should return a 501 response', function (done) {
        request(app)
            .get('/v1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(501)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('statusCode');
                expect(res.body.statusCode).to.equal(501);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.equal('Not Implemented');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('Route not implemented');

                return done();
            });
    });
});
