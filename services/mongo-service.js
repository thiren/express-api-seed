'use strict';

const config = require('config');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const Logger = mongodb.Logger;

const database = {
    init: init,
    close: close,
    client: null,
    db: null
};

module.exports = database;

function init(callback) {
    // NOTE: the connection string must be url encoded
    let url = config.get('mongo.url');
    let options = config.get('mongo.options');

    MongoClient.connect(url, options, (err, client) => {
        if (err) {
            return callback(err);
        }

        database.db = client.db(config.get('mongo.database'));

        callback();
    });
}

function close() {
    if (database.client) {
        database.client.close();
    }
}
