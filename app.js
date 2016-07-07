'use strict';

var express = require('express');
var morgan = require('morgan');
var winston = require('winston');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

winston.add(winston.transports.File, {
    level: 'info',
    filename: __dirname + '/logs/logs.log',
    timestamp: true
});

winston.log('info', 'Hello log files!');
winston.info('Hello again log files!');

var app = express();

app.disable('x-powered-by');

app.use(morgan('combined', {immediate: true}));
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
