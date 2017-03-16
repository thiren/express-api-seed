'use strict';

const _ = require('lodash');

const logger = require('../logging/logger');
const error = require('./error');

module.exports = {
    development: development,
    production: production
};

// development error handler
// will return stacktrace
function development(err, req, res, next) {
    let parsedError = error.parse(req, err);

    if (parsedError.statusCode >= 400 && parsedError.statusCode <= 499) {
        logger.warn(parsedError);
    } else if (parsedError.statusCode >= 500) {
        logger.error(parsedError);
    }

    res.status(parsedError.statusCode || 500);
    res.json(parsedError);
}

// production error handler
// no stacktraces leaked to user
function production(err, req, res, next) {
    let parsedError = error.parse(req, err);

    if (parsedError.statusCode >= 400 && parsedError.statusCode <= 499) {
        logger.warn(parsedError);
    } else if (parsedError.statusCode >= 500) {
        logger.error(parsedError);
    }

    res.status(parsedError.statusCode || 500);
    res.json(_.omit(parsedError, ['data', 'stack', 'request']));
}
