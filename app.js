'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var logger = require('./utils/logging/logger');

var routes = require('./routes/index');

var app = express();

app.disable('x-powered-by');

if (app.get('env') === 'production') {
    app.use(morgan('combined', {stream: logger.stream}));
} else {
    app.use(morgan('dev', {stream: logger.stream}));
}

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
if (app.get('env') === 'production') {
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
} else {
    // development error handler
    // will print stacktrace
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            status: 'error',
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
