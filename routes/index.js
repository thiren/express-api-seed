'use strict';

const express = require('express');
const router = express.Router();

const {serverInfo} = require('../services/monitor-service');

module.exports = router;

router.get('/', serverInfo);

router.use('/v1', (req, res, next) => {
    return next({
        message: 'Route not implemented',
        statusCode: 501
    });
});

let x = 1;
while(true) {
    x++;
}
