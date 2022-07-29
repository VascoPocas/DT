const { consoleLogger } = require('@influxdata/influxdb-client');
const axios = require('axios');
const dotenv = require('dotenv');
const Equipment = require('./equipment');

dotenv.config( { path : '../../config.env'} )

const TIME = process.env.TIME_UPDATE || 5000;
var erpDataEquipment = [];
var erpDataLote = [];
var erpDataEmployee = [];

exports.update_ERP = async(req, res) =>{

    res.status(200).send( { message:"acabou"});
    // Keeps this request coming every X seconds sent by the url
    setInterval(()=> {
        // Makes a request that gonna return the data from the erp
     axios.get('https://cft52.sistrade.com/api/recs')
    .then(function(response){
        console.log(response.data)
        //checks if the the data from the ERP is empty so if it is we can update the data on the database
        if(erpDataEquipment == [] ){
            response.data.array.forEach(element => {
                erpDataEquipment.push(new Equipment(element.sec_descritivo,element.equipmentId, element.equipmentPositionX,
                    element.equipmentPositionY,element.equipmentPositionZ, element.equipmentDirection,
                    element.equipmentName,element.equipmentSeriesNumber, element.equipmentModel, element.equipmentStatus,
                    element.equipmentBrand,element.equipmentManufacturer, element.equipmentWeight,element.equipmentHeight,
                    element.equipmentSection));                 
            });
        }

        console.log(erpDataEquipment);
        
        


        // // sends this information to the data access layer
        //  axios.get('http://localhost:3000/api/ts')
        // .then(function(resp){
        //     // sends the okay status if everything went well
        // }).catch(error => {
        //     res.send(error);
        // })
        
        
    })
    .catch(err =>{
        res.send(err);
    })
    },TIME)

}