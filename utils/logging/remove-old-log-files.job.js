'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var moment = require('moment');
var CronJob = require('cron').CronJob;
var appRootPath = require('app-root-path');

var logger = require('./logger');
var cronTimers = require('../scheduling/cron-timers.js');

module.exports = scheduledJob;

function scheduledJob() {
    logger.info('Starting log file remover job');
    var startTheJobAutomatically = true; //if false, remember to call job.start(), assuming job is the variable you set the cron job to.
    new CronJob(cronTimers.everyHour, onTick, onComplete, startTheJobAutomatically, 'Africa/Johannesburg');
}

function onTick(jobDone) {
    var fileRemovalThreshold = moment.utc().subtract(14, 'days');
    var logFilesPath = appRootPath.resolve('/logs');

    fs.readdir(logFilesPath, function (err, files) {
        if (err) {
            logger.error({message: 'Error reading log files for removal', error: err});
            return jobDone();
        }
        async.eachSeries(files, checkIfFileNeedsToBeRemoved, finishedRemovingOldFiles);
    });

    function checkIfFileNeedsToBeRemoved(file, done) {
        if (file === '.gitignore') {
            return done();
        }
        var filePath = path.join(logFilesPath, file);

        fs.stat(filePath, function (err, stats) {
            if (err) {
                logger.error({message: 'Error getting log files created date', error: err});
                return done();
            }

            var fileCreatedDate = moment.utc(stats.birthtime);

            if (fileCreatedDate.isAfter(fileRemovalThreshold)) {
                return done();
            }

            fs.unlink(filePath, function (err) {
                if (err) {
                    logger.error({message: 'Error deleting old log file', error: err});
                }
                done();
            });
        });
    }

    function finishedRemovingOldFiles(err) {
        if (err) {
            logger.error(err);
            if (jobDone) {
                return jobDone(err);
            }
        }
        if (jobDone) {
            return jobDone();
        }
    }
}

function onComplete() {
}
