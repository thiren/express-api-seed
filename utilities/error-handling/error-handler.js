'use strict';

const _ = require('lodash');

const error = require('./error');

module.exports = {
    development: development,
    production: production
};

// development error handler
// will return stacktrace
function development(err, req, res, next) {
    const parsedError = error.parse(req, err);

    if (parsedError.statusCode >= 400 && parsedError.statusCode <= 499) {
        console.warn(parsedError);
    } else {
        console.error(parsedError);
    }

    const status = parsedError.statusCode || 500;

    return res.status(status).json(parsedError);
}

// production error handler
// no stacktraces leaked to user
function production(err, req, res, next) {
    const parsedError = error.parse(req, err);

    if (parsedError.statusCode >= 400 && parsedError.statusCode <= 499) {
        console.warn(parsedError);
    } else {
        console.error(parsedError);
    }

    const status = parsedError.statusCode || 500;
    const response = _.omit(parsedError, ['data', 'stack', 'request']);

    return res.status(status).json(response);
}
