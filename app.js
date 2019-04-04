'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const initialiseRequestLogging = require('./utilities/logging/initialise-request-logging');
const initialiseErrorHandling = require('./utilities/error-handling/initialise-error-handling');

const routes = require('./routes/index');

const app = express();

initialiseRequestLogging(app);

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// api routes
app.use('/', routes);

initialiseErrorHandling(app);

module.exports = app;
