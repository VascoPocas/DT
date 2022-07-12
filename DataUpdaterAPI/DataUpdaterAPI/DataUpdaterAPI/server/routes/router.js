const express = require('express');
const route = express.Router()

// controller and services for mongoDB
const servicesSensor = require('../Sensor/render');
const servicesERP = require('../ERP/render');
const controllerSensor = require('../Sensor/controller');
const controllerERP = require('../ERP/controller');


/**
 *  @description for update the data in the ERP
 *  @method PUT /update-user
 */
route.get('/update-ERP/', servicesERP.update_ERP)

/**
 *  @description for update the data in the Sensor
 */
route.get('/update-Sensor/',servicesSensor.update_Sensor)


// API ERP vai mandar os dados para dar aupdate na bd
route.post('/api/erp/', controllerERP.create);

// API Sensor vai só enviar os dados para dar update na bd
route.get('/api/sensor/', controllerSensor.create);



module.exports = route