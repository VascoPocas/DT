const axios = require('axios');

exports.homeRoutesTS = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/ts')
        .then(function(response){
            console.log(response.data)
            res.json(response.data)
            res.render('index', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.homeRoutesTSId = (req, res) => {
    // Make a get request to /api/users
    console.log(res.query.id);
    axios.get('http://localhost:3000/api/ts', { params : { id : req.query.id }})
        .then(function(response){
            console.log(response.data)
            res.json(response.data)
            res.render('user', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}
 
exports.add_user = (req, res) =>{
    res.render('add_user');
}

exports.update_user = (req, res) =>{
    axios.get('http://localhost:3000/api/ts', { params : { id : req.query.id }})
        .then(function(userdata){
            res.render("update_user", { user : userdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}