'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const logger = require('./utils/logging/logger');
const requestSchemaIndex = require('./utils/request-validator/request-schema-index.json');
require('./utils/request-validator/request-validator').init(requestSchemaIndex);

let error = require('./utils/error');

let routes = require('./routes/index');

let app = express();

app.disable('x-powered-by');

if (app.get('env') === 'development') {
    app.use(morgan('dev', {stream: logger.stream}));
} else {
    app.use(morgan('combined', {stream: logger.stream}));
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = error.create(404, 'Not Found');
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    // development error handler
    // will print stacktrace
    app.use(function (err, req, res, next) {
        logger.error(err);
        res.status(err.statusCode || 500);
        res.json({
            status: 'error',
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        logger.error(err);
        res.status(err.statusCode || 500);
        res.json({
            status: 'error',
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
