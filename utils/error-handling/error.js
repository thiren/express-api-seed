'use strict';

const moment = require('moment');
const uuid = require('uuid');
const Boom = require('boom');
const _ = require('lodash');

const logger = require('../logging/logger');

module.exports = {
    parse: parse
};

function parse(req, err) {
    let error = err;
    let statusCode = 500;
    let message = null;
    let data = {};

    // todo: 401 errors are handled differently from other errors, will need to cater for that specific case

    if (error instanceof Error) {
        if (!error.isBoom) {
            error = Boom.wrap(error, statusCode, message);
        }

        if (typeof error.data === 'object') {
            data = error.data;
        } else if (typeof error.data === 'string') {
            data = {
                message: error.data
            };
        }
    } else {
        if (typeof err === 'object' && (_.has(err, 'statusCode') || _.has(err, 'status')) && _.has(err, 'message')) {
            statusCode = err.statusCode || err.status;
            message = err.message;
            if (_.has(err, 'data')) {
                if (typeof err.data === 'object') {
                    data = err.data;
                } else if (typeof err.data === 'string') {
                    data = {
                        message: err.data
                    };
                }
            }
        } else {
            data = err;
        }

        error = Boom.create(statusCode, message, data);

        if (typeof err === 'object' && _.has(err, 'stack')) {
            error.stack = err.stack;
        } else {
            error.stack = null;
        }
    }

    // todo: Added more information to the error object. (eg. url, user)

    const output = {
        statusCode: error.output.payload.statusCode,
        error: error.output.payload.error,
        message: error.output.payload.message,
        timestamp: moment.utc().toISOString(),
        data: data,
        stack: null,
        request: {
            reference: req.reference || uuid.v4(),
            method: req.method,
            url: req.originalUrl,
            query: req.query,
            body: req.body
        }
    };

    if (error.hasOwnProperty('stack') && (req.hasOwnProperty(error) && req.error.includeStack !== false)) {
        output.stack = error.stack;
    }

    return output;
}
