const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/', serverPulse);

function serverPulse(req, res, next) {
    res.status(200).json({
        api: 'node-api-seed',
        version: '0.0.0'
    });
}
