'use strict';

const config = require('config');
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

function initMongoConnection(callback) {
    // NOTE: the connection string must be url encoded
    let url = config.get('mongo.url');
    let options = config.get('mongo.options');

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
        throw new Error('Mongo Client Not Found');
    }

    return _client;
}

function db() {
    if (!_db) {
        throw new Error('Mongo DB not Found');
    }

    return _db;
}
