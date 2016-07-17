'use strict';

const express = require('express');
let router = express.Router();
let error = require('../utils/error');

router.get('/', function (req, res, next) {
    let test = error.create();

    console.log(JSON.stringify(test, null, 2));

    res.status(200).json({
        api: 'node-api-seed',
        version: '0.0.0'
    });
});

module.exports = router;
