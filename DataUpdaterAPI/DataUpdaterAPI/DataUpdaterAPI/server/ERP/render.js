const { consoleLogger } = require('@influxdata/influxdb-client');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config( { path : '../../config.env'} )

const TIME = process.env.TIME_UPDATE || 5000;

// exports.add_user = (req, res) =>{
//     res.render('add_user');
// }

exports.update_ERP = async(req, res) =>{

    res.status(200).send( { message:"acabou"});
    // Keeps this request coming every X seconds sent by the url
    setInterval(()=> {
        // Makes a request that gonna return the data from the erp
     axios.get('http://localhost:3000/api/ts')
    .then(function(response){
        console.log(response.data)
        // Uses the HASHMAP created to see if there is any change in the information
        // if there is updates the information by sending it to the DAL for the update
        // and changes the HASHMAP if not it does nothing
        /**
         * Create HASHMAP here with info
         */
        // sends this information to the data access layer
         axios.get('http://localhost:3000/api/ts')
        .then(function(resp){
            // sends the okay status if everything went well
        }).catch(error => {
            res.send(error);
        })
        
        
    })
    .catch(err =>{
        res.send(err);
    })
    },TIME)

}