const Boom = require('boom');

const errorHandler = require('./error-handler');

module.exports = initialiseErrorHandling;

function initialiseErrorHandling(app) {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        let data = {
            url: req.originalUrl,
        };
        next(Boom.create(404, 'Route not found', data));
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
