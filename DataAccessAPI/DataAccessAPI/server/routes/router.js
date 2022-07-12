const express = require('express');
const route = express.Router()

// controller and services for mongoDB
const services = require('../MONGO/render');
const servicesSQL = require('../SQL/renderSQL');
const servicesTS = require('../TS/renderTS');
const controller = require('../MONGO/controller');
const controllerSQL = require('../SQL/controllerSQL');
const controllerTS = require('../TS/controllerTS');


/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', services.homeRoutes);

/**
 *  @description Root Route user
 * @method GET /id
 */
route.get('/user', services.homeRoutesId);

/**
 *  @description add users
 *  @method GET /add-user
 */
route.get('/add-user', services.add_user)

/**
 *  @description for update user
 *  @method PUT /update-user
 */
route.get('/update-user', services.update_user)


// API MONGO 
route.post('/api/users', controller.create);
route.get('/api/users/:id', controller.find);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);

// API SQL
route.post('/api/sql', controllerSQL.create);
route.get('/api/sql/lotes/',controllerSQL.Lotes);
route.get('/api/sql/equipment', controllerSQL.find);
route.get('/api/sql/:id', controllerSQL.find);
route.put('/api/sql/:id', controllerSQL.update);
route.delete('/api/sql/:id', controllerSQL.delete);


// API TS
 route.post('/api/ts', controllerTS.create);
 //route.get('/api/ts/:id', controllerTS.find);
 route.get('/api/ts', controllerTS.find);
 route.put('/api/ts/:id', controllerTS.update);
 route.delete('/api/ts/:id', controllerTS.delete);


module.exports = route