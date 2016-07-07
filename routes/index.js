'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.status(200).json({
        api: 'node-api-seed',
        version: '0.0.0'
    });
});

module.exports = router;
