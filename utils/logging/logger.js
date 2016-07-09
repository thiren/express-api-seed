'use strict';

var winston = require('winston');
require('winston-daily-rotate-file');

var logger = new winston.Logger({
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'info',
            filename: './logs/file-logs',
            datePattern: '-yyyy-MM-ddTHH.log',
            handleExceptions: true,
            json: true,
            colorize: false,
            timestamp: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: false
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;
