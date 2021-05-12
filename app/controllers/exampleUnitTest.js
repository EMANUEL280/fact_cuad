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

    class Test {

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
         * Test Action
         * @returns {String}
         */
        test(collection, pipline, params) {
            return "Hello";
        }

    }

    return new Test();
})();

