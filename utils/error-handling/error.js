const uuid = require('node-uuid');
const Boom = require('boom');

const logger = require('../logging/logger');

module.exports = {
    parse: parse
};

function parse(err) {
    var error = err;
    var statusCode = 500;
    var message = null;
    var data = {};

    // todo: 401 errors are handled differently from other errors, will need to cater for that specific case

    if (error instanceof Error) {
        if (!error.isBoom) {
            logger.warn({message: 'The error passed to the error handler was not a Boom error', error: error});
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
        logger.error({message: 'The error passed to the error handler was not an instance of Error', error: error});
        error = Boom.create(statusCode, message, data);
    }

    // todo: Added more information to the error object. (eg. url)

    return {
        statusCode: error.output.payload.statusCode,
        error: error.output.payload.error,
        message: error.output.payload.message,
        timestamp: Date.now(),
        reference: uuid.v4(),
        data: data,
        stack: error.stack
    };
}
