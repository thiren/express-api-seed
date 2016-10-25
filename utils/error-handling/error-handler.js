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
    var parsedError = error.parse(err);

    logger.error(parsedError);

    res.status(parsedError.statusCode || 500);
    res.json(parsedError);
}

// production error handler
// no stacktraces leaked to user
function production(err, req, res, next) {
    var parsedError = error.parse(err);

    logger.error(parsedError);

    res.status(parsedError.statusCode || 500);
    res.json(_.omit(parsedError, ['data', 'stack']));
}
