'use strict';

const Boom = require('boom');

const errorHandler = require('./error-handler');

module.exports = initialiseErrorHandling;

function initialiseErrorHandling(app) {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        req.error = {
            includeStackTrace: false
        };

        next(new Boom('Route not found', {statusCode: 404}));
    });

    // error handlers
    if (app.get('env') === 'development') {
        // development error handler
        // will print stacktrace
        app.use(errorHandler.development);
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(errorHandler.production);
}
