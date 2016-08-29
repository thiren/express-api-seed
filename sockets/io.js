'use strict';

var io = require('socket.io')();
const debug = require('debug')('node-api-seed:server');
const logger = require('../utils/logging/logger');

function createServer(server) {
    if (!server) {
        return;
    }

    io.listen(server);

    io.use(function (socket, next) {
        next();
    });

    /**
     * Event listener for socket "connection" event.
     */

    io.on('connection', onConnection);

    function onConnection() {
        logger.info('Socket connected');
        debug('Socket connected');
    }
}

function close() {
    io.close();
}

module.exports = {
    createServer: createServer,
    close: close
};
