const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config( { path : '../../config.env'} )

const TIME = process.env.PORT || 5000
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

exports.update_Sensor = async(req, res) =>{
    res.status(200).send( { message:"acabou2"});
    setInterval(()=> {
        // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
    .then(function(response){
        console.log(response.data)
        // Sends the info nevertheless to the DAL bc there is always information coming
        // the information that is recieved is the data from the last X seconds before it is updated
        // X repeated update  =  x last seconds the info is recieved from the query
        
    })
    .catch(err =>{
        res.send(err);
    })
    },TIME)
}