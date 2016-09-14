'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const Boom = require('boom');

const logger = require('./utils/logging/logger');
const errorHandler = require('./utils/error-handling/error-handler');

const routes = require('./routes/index');

const app = express();

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
    var data = {
        url: req.originalUrl,
    };
    next(Boom.create(404, 'Route not found', data));
});

// error handlers
if (app.get('env') === 'development') {
    // development error handler
    // will print stacktrace
    app.use(errorHandler.development);
}

// production error handler
// no stacktraces leaked to user
app.use(errorHandler.production);

module.exports = app;
