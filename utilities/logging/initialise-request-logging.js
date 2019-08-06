'use strict';

const uuidv4 = require('uuid/v4');
const config = require('config');
const morgan = require('morgan');

module.exports = initialiseMorgan;

const stream = {
    write: (message, encoding) => {
        console.log(message);
    }
};

morgan.token('reference', (req) => {
    if (!req.reference) {
        return '';
    }

    return req.reference;
});

function initialiseMorgan(app) {
    app.use((req, res, next) => {
        req.reference = uuidv4();
        next();
    });

    const environment = config.get('server.environment');

    if (environment === 'test') {
        // Don't log requests when running tests
    } else if (environment === 'development') {
        app.use(morgan(':method :url', {
            stream: stream,
            immediate: true,
            skip: (req) => { return req.method === 'OPTIONS' }
        }));
        app.use(morgan('dev', {
            stream: stream,
            skip: (req) => { return req.method === 'OPTIONS' }
        }));
    } else {
        app.use(morgan(':reference :remote-addr - :remote-user ":method :url HTTP/:http-version" ":referrer" ":user-agent"', {
            stream: stream,
            immediate: true,
            skip: (req) => { return req.method === 'OPTIONS' }
        }));
        app.use(morgan(':reference :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
            stream: stream,
            skip: (req) => { return req.method === 'OPTIONS' }
        }));
    }
}
