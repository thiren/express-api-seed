'use strict';

const packageJson = require('../package.json');

module.exports = {
    serverInfo: serverInfo
};

function serverInfo(req, res, next) {
    const response = {
        name: packageJson.name,
        version: packageJson.version,
        environment: process.env.NODE_ENV
    };

    res.status(200).json(response);
}
