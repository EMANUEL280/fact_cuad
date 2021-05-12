/**
* @fileoverview Class to get current Login of project
*
* @author Cesar Rojas
* @version 1.0.0
*/
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

module.exports = (() => {

    'user strict';

    class Mongo {

        constructor() {

            const fileConfig = require("../config/global.js");
            this.config = fileConfig;

            const fs = require('fs');

            if (fs.existsSync('./config/local.js') || fs.existsSync('./app/config/local.js')) {
                const configLocal = require("../config/local.js");
                this.config = configLocal;
            }

            this.urlMongo = 'mongodb://' + this.config.mongodb.user + ':' + this.config.mongodb.pass + '@' + this.config.mongodb.host + ':' + this.config.mongodb.port + '/' + this.config.mongodb.db;

        }

        /**
         * Login Action
         * @param params {Object} params login action
         * @returns {Object}
         */
        agreggate(collection, pipline, mongo) {
            let parent = this;
            return new Promise(async (resolve, reject) => {
                //Select collection
                let col = mongo.collection(collection);
                col.aggregate(pipline).toArray(function (err, docs) {
                    assert.equal(null, err);
                    resolve(docs);
                });
            });
        }

        create(collection, data) {
            let parent = this;
            return new Promise(async (resolve, reject) => {
                //getClient
                let mongo = await parent.getClient();
                //Select collection
                let col = mongo.collection(collection);
                col.insertMany(data, function (err, resp) {
                    assert.equal(null, err);
                    resolve(resp);
                });

            });
        }

        createOne(collection, data, mongo) {
            let parent = this;
            return new Promise(async (resolve, reject) => {
                //Select collection
                let col = mongo.collection(collection);
                col.insertOne(data, function (err, resp) {
                    assert.equal(null, err);
                    resolve(resp);
                });

            });
        }

        getClient() {
            let parent = this;
            return new Promise((resolve, reject) => {
                try {
                    MongoClient.connect(parent.urlMongo, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                        assert.equal(null, err);
                        if (err !== null)
                            reject(err);
                        resolve(client.db(parent.config.mongodb.db));
                        parent.db = client;
                        //client.close();
                        return;
                    });
                } catch (err) {
                    resolve(err);
                }
                return;
            });
        }
    }

    return new Mongo();
})();

