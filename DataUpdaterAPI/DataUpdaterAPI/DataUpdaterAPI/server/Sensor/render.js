const axios = require('axios');
const dotenv = require('dotenv');
const { Time, Int } = require('mssql');
const Sensor = require('./sensor');

dotenv.config( { path : '../../config.env'} )

const TIME = process.env.PORT || 5100
// exports.homeRoutes = (req, res) => {
//     // Make a get request to /api/users
//     axios.get('http://localhost:3000/api/users')
//         .then(function(response){
//             console.log(response.data)
//             res.json(response.data)
//             res.render('index', { users : response.data });
//         })
//         .catch(err =>{
//             res.send(err);
//         })

    
// }

// exports.homeRoutesId = (req, res) => {
//     // Make a get request to /api/users
//     console.log(res.query.id);
//     axios.get('http://localhost:3000/api/users', { params : { id : req.query.id }})
//         .then(function(response){
//             console.log(response.data)
//             res.json(response.data)
//             res.render('user', { users : response.data });
//         })
//         .catch(err =>{
//             res.send(err);
//         })

    
// }
 
// exports.add_user = (req, res) =>{
//     res.render('add_user');
// }

exports.update_Sensor = async (req, res) =>{
    
    setInterval(()=> {
        // creates the data so we can start getting the last value for the sensor
        let date = new Date();
        let day = date.getDay();
        let month = date.getMonth();
        let year = date.getFullYear();
        let hours = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let dataInicio = hours+":"+min+":"+ Number.parseInt( sec -5);
            // Make a get request to /api/sensores
     axios.get('https://cft52.sistrade.com/api//Sensors?dataInicio='+month+'-'+day+'-'+year+' '+dataInicio+'&dataFim='+month+'-'+day+'-'+year+' '+hours+':'+min+':'+sec)
    .then(function(response){
        console.log(response.data);
        var sensor =  new Sensor(response.data[0].timestamp,response.data[0].value);
        // Sends the info nevertheless to the DAL bc there is always information coming
        // the information that is recieved is the data from the last X seconds before it is updated
        // X repeated update  =  x last seconds the info is recieved from the query
        axios.post('http://localhost:3000/api/ts/'+ sensor.value).then(function(response){
            console.log(response.data);
        })
    })
    .catch(err =>{
        //res.send(err);
        return;
    })
    },TIME)

    res.status(200).send( { message:"acabou"});
}