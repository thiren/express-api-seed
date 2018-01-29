'use strict';

const packageJson = require('../package.json');

module.exports = {
    pulse: pulse
};

function pulse(req, res, next) {
    const response = {
        name: packageJson.name,
        version: packageJson.version,
        environment: process.env.NODE_ENV,
        platform: process.platform,
        architecture: process.arch,
        nodeVersion: process.version,
        pid: process.pid,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    };

    res.status(200).json(response);
}
