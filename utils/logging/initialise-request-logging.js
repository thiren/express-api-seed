const _ = require('lodash');
const uuid = require('uuid');
const morgan = require('morgan');

const logger = require('./logger');

module.exports = initialiseMorgan;

morgan.token('reference', function (req) {
    if (!req.reference) {
        return '';
    }

    return req.reference;
});

function initialiseMorgan(app) {
    app.use(function (req, res, next) {
        req.reference = uuid.v4();
        next();
    });
    if (app.get('env') === 'test') {
        // Don't log requests when running tests
    } else if (app.get('env') === 'development') {
        app.use(morgan(':method :url', {
            stream: logger.stream,
            immediate: true,
            skip: skip
        }));
        app.use(morgan('dev', {
            stream: logger.stream,
            skip: skip
        }));
    } else {
        app.use(morgan(':reference :remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" ":referrer" ":user-agent"', {
            stream: logger.stream,
            immediate: true,
            skip: skip
        }));
        app.use(morgan(':reference :remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
            stream: logger.stream,
            skip: skip
        }));
    }
}

function skip(req, res) {
    return _.includes(['/favicon.ico'], req.originalUrl);
}
