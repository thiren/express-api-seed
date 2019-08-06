'use strict';

const {MongoClient, Logger} = require('mongodb');

// NOTE: the default mongo log level is error
Logger.setCurrentLogger(function (msg, context) {
    console.error({message: msg, context: context});
});

let _client;
let _db;


module.exports = {
    initMongoConnection,
    closeMongoConnection,
    client,
    db
};

function initMongoConnection(config, callback) {
    if (!config) {
        throw new Error('Invalid MongoDB Config');
    } else if (!config.hasOwnProperty('url')) {
        throw new Error('Invalid MongoDB Config - Missing Required Property: url');
    } else if (!config.hasOwnProperty('options')) {
        throw new Error('Invalid MongoDB Config - Missing Required Property: options');
    }

    // NOTE: the connection string must be url encoded
    let url = config.url;
    let options = config.options;

    MongoClient.connect(url, options, (err, client) => {
        if (err) {
            return callback(err);
        }

        _client = client;
        _db = client.db();

        return callback(null, {
            client: _client,
            db: _db
        });
    });
}

function closeMongoConnection() {
    if (_client) {
        _client.close();
    }
}

function client() {
    if (!_client) {
        throw new Error('MongoDB Client Not Found');
    }

    return _client;
}

function db() {
    if (!_db) {
        throw new Error('MongoDB Database Not Found');
    }

    return _db;
}
