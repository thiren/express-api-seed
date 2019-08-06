'use strict';

const _ = require('lodash');
const util = require('util');
const config = require('config');
const winston = require('winston');
const {Loggly} = require('winston-loggly-bulk');

const environment = config.get('server.environment') || 'production';

const defaultLoggingLevel = config.get('logging.level');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    exitOnError: false,
    transports: []
});

if (environment === 'test') {
    // NOTE: don't log anything when running tests
    setupConsoleTransport(logger, {silent: true}, 'info');
} else if (environment === 'development') {
    setupConsoleTransport(logger, {silent: false}, 'info');
} else {
    setupConsoleTransport(logger, {silent: false}, 'info');
    // setupLogglyTransport(logger, 'info');
}

module.exports = logger;

console.log = function () {
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function () {
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function () {
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function () {
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function () {
    logger.debug.apply(logger, formatArgs(arguments));
};

function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

function setupConsoleTransport(logger, opt, level) {
    if (!level) {
        level = defaultLoggingLevel;
    }

    let options = {
        level: level,
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple()
        )
    };

    logger.add(new winston.transports.Console(_.merge(options, opt || {})));
}

function setupLogglyTransport(logger, level) {
    if (!level) {
        level = defaultLoggingLevel;
    }
    if (!config.get('logging.loggly.token')) {
        return console.log('Loggly logging not enabled');
    }

    let logglyConfig = _.cloneDeep(config.get('logging.loggly'));

    let options = _.merge({}, {
        level: level,
        json: true,
        timestamp: true
    }, logglyConfig);

    logger.add(new Loggly(options));
}
