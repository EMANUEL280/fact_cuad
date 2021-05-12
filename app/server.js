/**
* @fileoverview Class to get current config of project
*
* @author Emanuel Jardines
* @version 1.0.0
*/

const { ServiceBroker } = require("moleculer");
const ApiService = require("moleculer-web");
const serviceBroker = require("./models/serviceBroker.js");
const node = require("./models/node.js");
const mongoService = require("./service/mongo.js");
const assert = require('assert');


module.exports = (() => {
    'use strict';

    class Server {

        constructor() {

            const fileConfig = require("./config/global.js");
            this.config = fileConfig;

            const fs = require('fs');

            if (fs.existsSync('./config/local.js') || fs.existsSync('./app/config/local.js')) {
                const configLocal = require("./config/local.js");
                this.config = configLocal;
            }

            this.urlMongo = 'mongodb://' + this.config.mongodb.user + ':' + this.config.mongodb.pass + '@' + this.config.mongodb.host + ':' + this.config.mongodb.port + '/' + this.config.mongodb.db;

        }

        /**
         * Start webServer
         * @returns {Object} Server Running
         */
        async start() {

            let db = await mongoService.getClient();
            const broker = new ServiceBroker(serviceBroker.getConfig());
            broker.createService(node.getConfig(broker, ApiService, db));
            broker.start();
        }
    }

    let server = new Server();
    server.start();

})();

