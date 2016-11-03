const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const initialiseRequestLogging = require('./utils/logging/initialise-request-logging');
const initialiseErrorHandling = require('./utils/error-handling/initialise-error-handling');

const routes = require('./routes/index');

const app = express();

app.disable('x-powered-by');

initialiseRequestLogging(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// api routes
app.use('/', routes);

initialiseErrorHandling(app);

module.exports = app;
