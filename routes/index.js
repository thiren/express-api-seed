'use strict';

const express = require('express');
const router = express.Router();

const monitorService = require('../services/monitor-service');

module.exports = router;

router.get('/', monitorService.pulse);
