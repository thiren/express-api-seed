'use strict';

const uuid = require('node-uuid');
let Boom = require('boom');

module.exports = {
    create: create
};

function create(statusCode = 500, message = 'Internal server error', data = {}) {
    let error = Boom.create(statusCode, message, data);

    return {
        statusCode: error.output.payload.statusCode,
        error: error.output.payload.error,
        message: error.output.payload.message,
        timestamp: Date.now(),
        reference: uuid.v4(),
        headers: error.output.headers,
        data: error.data
    };
}
