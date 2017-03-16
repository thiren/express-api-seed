'use strict';

const express = require('express');
const router = express.Router();

const packageJson = require('../package.json');

module.exports = router;

router.get('/', serverPulse);

function serverPulse(req, res, next) {
    res.status(200).json({
        api: packageJson.name,
        version: packageJson.version
    });
}
