'use strict';

var express = require('express');
var morgan = require('morgan');
var winston = require('winston');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

// winston.add(winston.transports.File, {
//     level: 'info',
//     filename: __dirname + '/logs/logs.log',
//     timestamp: true
// });

// winston.log('info', 'Hello log files!');
// winston.info('Hello again log files!');

var app = express();

app.disable('x-powered-by');

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

app.use(morgan('dev', {immediate: true}));
app.use(morgan('combined', {stream: logger.stream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            status: 'error',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: 'error',
        message: err.message,
        error: {}
    });
});

module.exports = app;
