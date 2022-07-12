const axios = require('axios');

exports.homeRoutesSQL = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/sql')
        .then(function(response){
            console.log(response.data)
            res.json(response.data)
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.homeRoutesSQLId = (req, res) => {
    // Make a get request to /api/users
    console.log(res.query.id);
    axios.get('http://localhost:3000/api/sql', { params : { id : req.query.id }})
        .then(function(response){
            console.log(response.data)
            res.json(response.data)
        })
        .catch(err =>{
            res.send(err);
        })

    
}
 
exports.add_user = (req, res) =>{
    res.render('add_user');
}

exports.update_user = (req, res) =>{
    axios.get('http://localhost:3000/api/sql', { params : { id : req.query.id }})
        .then(function(userdata){
            res.render("update_user", { user : userdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}