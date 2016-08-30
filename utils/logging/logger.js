'use strict';

var _ = require('lodash');
var config = require('config');
var winston = require('winston');
require('winston-daily-rotate-file');
require('winston-loggly');

var environment = process.env.NODE_ENV || 'development';

var defaultLoggingLevel = config.get('logging').level;

var winstonOptions = {
    transports: [],
    exitOnError: false
};

if (environment === 'production') {
    winstonOptions.transports.push(getConsoleTransport('info'));
    winstonOptions.transports.push(getFileTransport('info'));
    winstonOptions.transports.push(getLogglyTransport('warn'));
} else if (environment === 'test') {
    // don't log anything when running tests
} else {
    winstonOptions.transports.push(getConsoleTransport('info'));
    winstonOptions.transports.push(getFileTransport('info'));
}

var logger = new winston.Logger(winstonOptions);

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

    var options = {
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

    var options = {
        name: 'file',
        level: level,
        filename: './logs/winston-file-logs',
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

    var logglyConfig = _.cloneDeep(config.get('logging').loggly);

    var options = _.merge({}, { level: level, json: true}, logglyConfig);

    return new winston.transports.Loggly(options);
}
