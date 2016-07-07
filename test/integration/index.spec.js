'use strict';

var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../app');

describe('Base route', function () {
    it('should return a 200 response', function (done) {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('api');
                expect(res.body.api).to.not.equal(null);
                expect(res.body).to.have.property('version');
                expect(res.body.version).to.not.equal(null);
                done();
            });
    })
});
