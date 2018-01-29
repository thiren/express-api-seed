'use strict';

const _ = require('lodash');
const util = require('util');
const path = require('path');
const config = require('config');
const winston = require('winston');
const appRoot = require('app-root-path');
require('winston-daily-rotate-file');
require('winston-loggly');

const environment = config.get('server.environment');

const defaultLoggingLevel = config.get('logging.level');

const logger = new winston.Logger({
    exitOnError: false
});

if (environment === 'test') {
    // NOTE: don't log anything when running tests
    setupConsoleTransport(logger, {silent: true}, 'info');
} else if (environment === 'development') {
    setupConsoleTransport(logger, {silent: false}, 'info');
    setupFileTransport(logger, 'info');
} else {
    setupConsoleTransport(logger, {silent: false}, 'info');
    setupFileTransport(logger, 'info');
    //setupLogglyTransport(logger, 'warn');
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
        name: 'console',
        level: level,
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: false
    };

    logger.add(winston.transports.Console, _.merge(options, opt || {}));
}

function setupFileTransport(logger, level) {
    if (!level) {
        level = defaultLoggingLevel;
    }

    let options = {
        name: 'file',
        level: level,
        filename: path.join(appRoot.resolve('logs'), 'logs'),
        datePattern: '-yyyy-MM-ddTHH.log',
        handleExceptions: true,
        colorize: false,
        timestamp: true
    };

    logger.add(winston.transports.DailyRotateFile, options);
}

function setupLogglyTransport(logger, level) {
    if (!level) {
        level = defaultLoggingLevel;
    }

    let logglyConfig = _.cloneDeep(config.get('logging.loggly'));

    let options = _.merge({}, {
        level: level,
        json: true,
    }, logglyConfig);

    logger.add(winston.transports.Loggly, options);
}
