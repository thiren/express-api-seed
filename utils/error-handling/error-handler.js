'use strict';

var _ = require('lodash');
var path = require('path');
var accepts = require('accepts');
var appRootPath = require('app-root-path');
var logger = require('../logging/logger');
var error = require('./error');

module.exports = {
    development: development,
    production: production
};

// development error handler
// will return stacktrace
function development(err, req, res, next) {
    var accept = accepts(req);

    var parsedError = error.parse(err);

    logger.error(parsedError);

    switch (accept.type(['json', 'html'])) {
        case 'json':
            res.status(parsedError.statusCode || 500);
            res.setHeader('Content-Type', 'application/json');
            res.json(parsedError);
            break;
        case 'html':
            if (parsedError.statusCode === 404) {
                res.setHeader('Content-Type', 'text/html');
                return res.sendFile(path.join(appRootPath.path, '/public/404.html'));
            }
            res.status(parsedError.statusCode || 500);
            res.send();
            break;
        default:
            res.status(parsedError.statusCode || 500);
            res.setHeader('Content-Type', 'application/json');
            res.json(parsedError);
            break;
    }
}

// production error handler
// no stacktraces leaked to user
function production(err, req, res, next) {
    var accept = accepts(req);

    var parsedError = error.parse(err);

    logger.error(parsedError);

    switch (accept.type(['json', 'html'])) {
        case 'json':
            res.status(parsedError.statusCode || 500);
            res.setHeader('Content-Type', 'application/json');
            res.json(_.omit(parsedError, ['data', 'stack']));
            break;
        case 'html':
            if (parsedError.status === 404) {
                res.setHeader('Content-Type', 'text/html');
                return res.sendFile(path.join(appRootPath.path, '/public/404.html'));
            }
            res.status(parsedError.statusCode || 500);
            res.send();
            break;
        default:
            res.status(parsedError.statusCode || 500);
            res.setHeader('Content-Type', 'application/json');
            res.json(_.omit(parsedError, ['data', 'stack']));
            break;
    }
}
