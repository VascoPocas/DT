const express = require('express');
const route = express.Router()
var multer = require('multer');
var upload = multer();
// controller and services for mongoDB
const controller = require('../MONGO/controller');
const controllerSQL = require('../SQL/controllerSQL');
const controllerTS = require('../TS/controllerTS');


// API MONGO 
 route.post('/api/mongo/employee',upload.single("model") ,controller.createEmployee);
 route.post('/api/mongo/lotes',upload.single("model"), controller.createLote);
 route.post('/api/mongo/equipment',upload.single("model"), controller.createEquipment);
 route.get('/api/mongo/lotes', controller.findLotes);
 route.get('/api/mongo/employee', controller.findEmployee);
 route.get('/api/mongo/equipment',controller.findEquipment);
 route.put('/api/mongo/employee/:id',upload.single("model") , controller.updateEmployee);
 route.put('/api/mongo/lotes/:id',upload.single("model") , controller.updateLote);
 route.put('/api/mongo/equipment/:id',upload.single("model") , controller.updateEquipment);
 route.delete('/api/mongo/employee/:id', controller.deleteEmployee);
 route.delete('/api/mongo/lotes/:id', controller.deleteLote);
 route.delete('/api/mongo/equipment/:id', controller.deleteEquipment);


// API SQL
route.post('/api/sql/equipment', controllerSQL.create);
route.post('/api/sql/lote', controllerSQL.createLote);
route.post('/api/sql/employee', controllerSQL.createEmployee);
route.get('/api/sql/employees/',controllerSQL.Employee);
route.get('/api/sql/lotes/',controllerSQL.Lotes);
route.get('/api/sql/equipment', controllerSQL.find);
route.put('/api/sql/lotes/:id', controllerSQL.updateLotes);
route.put('/api/sql/employee/:id', controllerSQL.updateEmployee);
route.put('/api/sql/equipment/:id', controllerSQL.update);
route.delete('/api/sql/employee/:id', controllerSQL.deleteEmployee);
route.delete('/api/sql/equipment/:id', controllerSQL.deleteEquipment);
route.delete('/api/sql/lotes/:id', controllerSQL.deleteLote);


// API TS
 route.post('/api/ts/:value', controllerTS.create);
 route.get('/api/ts', controllerTS.find);
 route.put('/api/ts/:id', controllerTS.update);
 route.delete('/api/ts/:id', controllerTS.delete);


module.exports = route