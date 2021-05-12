/**
* @fileoverview Class to get current config of project
*
* @author Cesar Rojas
* @version 1.0.0
*/
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongo = require("../service/mongo");
const fs = require("fs");
const fact = require("../controllers/facturacion");

module.exports = (() => {

    'user strict';

    class Node {

        constructor() {

            this.db = null;
            this.session = true;

            const fileConfig = require("../config/global.js");
            this.config = fileConfig;

            const fs = require('fs');

            if (fs.existsSync('./config/local.js') || fs.existsSync('./app/config/local.js')) {
                const configLocal = require("../config/local.js");
                this.config = configLocal;
            }

            this.callbackGlobal = function (broker, functionName, params) {

                return new Promise((resolve, reject) => {
                    try {
                        let resp = broker.call(functionName, params, { timeout: (60 * 15) * 1000, retryCount: 2 }).catch(
                            (err) => {
                                console.error("Servicio no encontrado!", err.type);
                                resp = err;
                                console.error(err);
                                reject(err);
                            }
                        );
                        resolve(resp);

                    } catch (Exception) {
                        reject(Exception);
                    }

                });

            };

        }

        /**
         * Gets config broker
         * @param broker {Object} Object broker Instance
         * @param ApiService {Object} Object ApiService Instance moleculer-web
         * @returns {Object}
         */
        getConfig(broker, ApiService, db) {
            let parent = this;
            return {
                name: "facturacion",
                mixins: [ApiService],
                settings: {
                    port: this.config.port,
                    use: [
                        cookieParser(),
                        helmet(),
                        (req, res, next) => {
                            if (parent.db == null)
                                parent.db = db
                            next();
                        }
                    ],
                    routes: [{
                        path: "/sentry/facturacion/",

                        aliases: {
                            "POST createPeriodoFacturacion": "facturacion.createFacturacion",
                        }

                    }]
                },
                actions: {
                    /**
                     * ETL License Report, extract data AS : Enterprises, Groups, Users, Licenses, SLP, Services
                     * @returns {Object}
                    */
                    async createFacturacion(ctx) {
                        try {
                           var result = await fact.createFacturacion();
                        } catch (err) {
                            console.log("Error in ETL's \n" + err);
                        }finally{
                            return result;
                        }
                    }
                }
            }
        }
    }

    return new Node();
})();