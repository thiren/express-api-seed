'use strict';

const express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
    res.status(200).json({
        api: 'node-api-seed',
        version: '0.0.0'
    });
});

module.exports = router;
