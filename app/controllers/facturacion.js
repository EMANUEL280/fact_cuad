/**
* @fileoverview Controller to audit users with voice messaging service 
*
* @author Cesar Rojas 
* @version 1.0.0
*/
const mongo = require("../service/mongo");
const fs = require("fs");
//onst odin = require('../models/cloudPBX');
const format = require("../util/cloudPBX");
const users = require('../util/usersPBX');
const classifcation = require('../util/classificationPBX');
const csvtojson = require('csvtojson');
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

//let url = "mongodb://root:123456@localhost:27017/stage";
let url = "mongodb://maaguilar:yADvJ8Vqgh4WD8t6us9M@10.3.18.93:27017/Vsys_ms";
//let url = "mongodb://riflores:uD2kC2tm6KAhgKS6qQfZ@10.3.18.93:27017/Vsys_ms";

/**
 * Pants module.
 * @module auditUsers
*/
module.exports = (function () {

    'use strict';

    /** Class representing to audit users with voice messaging service  */
    class auditUsers {

        /**
         * Create Config Local or Global & to class
         */
        constructor() {

            const fileConfig = require("../config/global.js");
            this.config = fileConfig;

            const fs = require('fs');

            if (fs.existsSync('./config/local.js') || fs.existsSync('./app/config/local.js')) {
                const configLocal = require("../config/local.js");
                this.config = configLocal;
            }

        }

        /**
         * Authetication Action
         * @param {Object} db MongoDB CLient
         * @returns {Object} The response value.
         */
        async createFacturacion(){
            return new Promise((resolve, reject) => {
                try{
                    var facData = [];
                    csvtojson().fromFile('./app/file/facturacionCisco/FacturacionMarzo21.csv')
                    .then(async csvData => {
                        let total = await new Promise(async (resolve, reject) => {
                            MongoClient.connect(url,{useUnifiedTopology:true},async (err, db) => {
                                if (err) throw err;
                                let dbo = db.db("Vsys_ms");
                                let periodo = csvData[0].period;
                                if(periodo.length == 10){
                                    periodo = periodo.split('/');
                                    periodo = new RegExp(`${periodo[2]}-${periodo[1]}`, "i");    
                                }else{
                                    periodo = periodo.split('/');
                                    let mes = parseInt(periodo[0].length) == 1 ? `0${periodo[0]}`: periodo[0];
                                    periodo = new RegExp(`${periodo[2]}-${mes}`, "i");
                                }

                                /*let exits = await dbo.collection("invoicedCUAD").aggregate([
                                    {
                                        $project: {
                                            "period": { $dateToString: {format: "%Y-%m-%d", date: "$period"}},key:1
                                        }
                                    },
                                    {
                                        $match: {
                                            period: periodo
                                        }
                                    }
                                ]).toArray();*/

                                //if(exits.length == 0){
                                    dbo.collection("invoicedCUAD").find({}).sort({$natural:-1}).limit(1).toArray((error, res) => {
                                        if (error) throw error;
                                        let rs = res[0]._id;
                                        rs = rs.split('-');
                                        rs = parseInt(rs[1]);
                                        resolve(rs);
                                    });
                                //}else{
                                    //resolve(-1);
                                //}
                            });
                        });

                        console.log(total);
                        
                        if(total != -1){
                            for(let i = 0; csvData.length > i; i++){
                                let unitaryPrice = csvData[i].unitaryPrice;
                                let rent = csvData[i].rent;
                                if(isNaN(rent)){
                                    rent = rent.split("$");
                                    if(rent[1].indexOf(",") == -1){
                                        rent = rent[1];
                                    }else{
                                        rent = rent[1].split(",");
                                        rent = `${rent[0] + rent[1]}`;
                                    }
                                }
                                
                                let startDate = csvData[i].startDate;
                                if(startDate.length == 10){
                                    startDate = startDate.split('/');
                                    if(parseInt(startDate[1]) > 12){
                                        startDate = `${startDate[2]}-${startDate[0]}-${startDate[1]}`;    
                                    }else{
                                        startDate = `${startDate[2]}-${startDate[1]}-${startDate[0]}`;    
                                    }
                                }else{
                                    startDate = startDate.split('/');
                                    let mes,dia,ano;
                                    if(startDate[2] != undefined){
                                        ano = startDate[2].replace(/[&\/\\#,+()$~%.'":*?�<>{}]/g, '');
                                    }
                                    if(parseInt(startDate[1]) > 12){
                                        dia = startDate[1];
                                        mes = startDate[0].replace(/[&\/\\#,+()$~%.'":*?�<>{}]/g, '');
                                        mes = parseInt(mes.length) == 1 ? `0${mes}`: mes;
                                    }else{
                                        mes = startDate[1];
                                        dia = startDate[0].replace(/[&\/\\#,+()$~%.'":*?�<>{}]/g, '');
                                    }

                                    startDate = `${ano}-${mes}-${dia}`;
                                }
                                let folio = csvData[i].folio.replace(/[&\/\\#,+()$~%.'":*?�<>{}]/g, '');
                                let period = csvData[0].period;
                                let unrId = 0;
                                period = period.split('/');
                                period = `${period[2]}-${period[1]}-${period[0]}`;
                                //console.log(folio);
                                //console.log(csvData[i].unrId);
                                if(csvData[i].unrId == "N/A"){
                                    unrId = 0;
                                }else{
                                    unrId = parseInt(csvData[i].unrId);
                                }

                                //console.log(unrId);
                                if(folio != ''){
                                    facData.push({
                                        _id: `FAC-${i + 1 + total}`,
                                        folio: folio,
                                        startDate: new Date(moment(startDate).toISOString()),
                                        service: "CUAD-CISCO",
                                        period: new Date(moment(period).toISOString()),
                                        sku: csvData[i].sku,
                                        partId: isNaN(csvData[i].partId) == false ? parseInt(csvData[i].partId) : csvData[i].partId,
                                        unr: csvData[i].unr,
                                        unrId: unrId,
                                        qty: Number(parseFloat(csvData[i].qty)) == NaN ? 0: parseFloat(csvData[i].qty),
                                        fac_qty: Number(parseFloat(csvData[i].fac_qty)) == NaN ? 0: parseFloat(csvData[i].fac_qty),
                                        unitaryPrice: Number(parseFloat(unitaryPrice)) == NaN ? 0: parseFloat(unitaryPrice),
                                        rent: Number(parseFloat(rent)) == NaN ? 0 : parseFloat(rent)
                                    });
                                }
                            }
    
                            MongoClient.connect(url, { useUnifiedTopology: true },(err, db) => { 
                                if (err) throw err;
                                let dbo = db.db("Vsys_ms");
    
                                dbo.collection("invoicedCUAD").insertMany(facData, (err, res) => {
                                    if (err) throw err;
                                    console.log("inserted");
                                    resolve('inserted');
                                    db.close();
                                });
                            });
                        }
                    })
                }catch(e){
                    reject(e);
                }
            });
        }
    }

    return new auditUsers();
})();
