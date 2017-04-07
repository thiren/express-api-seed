'use strict';

const _ = require('lodash');
const path = require('path');
const config = require('config');
const winston = require('winston');
const appRoot = require('app-root-path');
require('winston-daily-rotate-file');
require('winston-loggly-bulk');

const environment = process.env.NODE_ENV || 'development';

const defaultLoggingLevel = config.get('logging').level;

const winstonOptions = {
    transports: [],
    exitOnError: false
};

if (environment === 'production' || environment === 'qa') {
    winstonOptions.transports.push(getConsoleTransport('info'));
    winstonOptions.transports.push(getFileTransport('info'));
    winstonOptions.transports.push(getLogglyTransport('warn'));
} else if (environment === 'test') {
    // don't log anything when running tests
} else {
    winstonOptions.transports.push(getConsoleTransport('info'));
    winstonOptions.transports.push(getFileTransport('info'));
}

const logger = new winston.Logger(winstonOptions);

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;

function getConsoleTransport(level) {
    if (!level) {
        level = defaultLoggingLevel;
    }

    let options = {
        name: 'console',
        level: level,
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: false
    };

    return new winston.transports.Console(options);
}

function getFileTransport(level) {
    if (!level) {
        level = defaultLoggingLevel;
    }

    let options = {
        name: 'file',
        level: level,
        filename: path.join(appRoot.resolve('logs'), 'logs'),
        datePattern: '-yyyy-MM-ddTHH.log',
        handleExceptions: true,
        json: true,
        colorize: false,
        timestamp: true
    };

    return new winston.transports.DailyRotateFile(options);
}

function getLogglyTransport(level) {
    if (!level) {
        level = defaultLoggingLevel;
    }

    let logglyConfig = _.cloneDeep(config.get('logging').loggly);

    let options = _.merge({}, {
        level: level,
        isBulk: true,
        json: true,
        stripColors: true,
        bufferOptions: {size: 1000, retriesInMilliSeconds: 60 * 1000}
    }, logglyConfig);

    return new winston.transports.Loggly(options);
}
