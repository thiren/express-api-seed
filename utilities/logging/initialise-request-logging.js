'use strict';

const uuidv4 = require('uuid/v4');
const config = require('config');
const morgan = require('morgan');

module.exports = initialiseMorgan;

const stream = {
    write: function (message, encoding) {
        console.log(message);
    }
};

morgan.token('reference', function (req) {
    if (!req.reference) {
        return '';
    }

    return req.reference;
});

function initialiseMorgan(app) {
    app.use(function (req, res, next) {
        req.reference = uuidv4();
        next();
    });

    const environment = config.get('server.environment');

    if (environment === 'test') {
        // Don't log requests when running tests
    } else if (environment === 'development') {
        app.use(morgan(':method :url', {
            stream: stream,
            immediate: true
        }));
        app.use(morgan('dev', {
            stream: stream
        }));
    } else {
        app.use(morgan(':reference :remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" ":referrer" ":user-agent"', {
            stream: stream,
            immediate: true
        }));
        app.use(morgan(':reference :remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
            stream: stream
        }));
    }
}
