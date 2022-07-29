const Model = require("./model");
const dotenv = require('dotenv');
const { consoleLogger } = require("@influxdata/influxdb-client");
dotenv.config( { path : 'config.env'} )
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_URI;
// create and save new model
exports.createEmployee = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    

    // new model
    const model = new Employee({
        id : req.body.id,
        model : req.file
    })

       
      //makes the conenction to the databse
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        // checks if the connection is inserting the data
        dbo.collection("Employee").insertOne(model, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            // closes the connection
            db.close();
            
        });
        });
        // sned confirmation that everything went well
        res.status(200).send( { message : "documented inserted!"});
}


// create and save new model
exports.createLote = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    

    // new model
    const model = new Model({
        id : req.body.id,
        model : req.file
    })

      // makes the connection to the databse
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        // checks if the collection is right and inserts a document
        dbo.collection("Lotes").insertOne(model, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            //closes the connection
            db.close();
            
        });
        });
        // send the message that everything went well adn the document was inserted
        res.status(200).send( { message : "documented inserted!"});
}

// create and save new model
exports.createEquipment = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    

    // new model
    const model = new Model({
        id : req.body.id,
        model : req.file
    })
      // conencts to the database 
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        // makes sure the collection is right and inserts a document
        dbo.collection("Equipment").insertOne(model, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            //close the conenction
            db.close();

            
        });
        });
        // sends the msg that everything went well
        res.status(200).send( { message : "documented inserted!"});
}

// retrieve and return all employees/ retrive and return a single user
exports.findEmployee = (req, res)=>{
    if(req.params.id){
        const ids = req.params.id;
    
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("DT");
            dbo.collection("Employee").find({ id: ids}, function(err, result) {
              if (err) throw err;
              console.log(result.name);
              db.close();
            });
          });

    }else{
        // create the connection
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("DT");
            // checks that the collection is right and returns the data about the employees
            dbo.collection("Employee").find({}).toArray( function(err, result) {
              if (err) throw err;
              // closes the connection adn send the data as JSON
              db.close();
              res.send(result);
            });
          });
    }

    
}

// retrieve and return all employees/ retrive and return a single user
exports.findLotes = (req, res)=>{
    if(req.params.id){
        const ids = req.params.id;
        // connects to the database
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("DT");
            // checks if the collection is right and returns the one with the id sent in the request
            dbo.collection("Lotes").find({ id: ids}, function(err, result) {
              if (err) throw err;
              console.log(result.name);
              db.close();
            });
          });

    }else{
        // conects tot he database
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("DT");
            // checks if the collection is right and returns all the documents
            dbo.collection("Lotes").find({}).toArray( function(err, result) {
              if (err) throw err;
              db.close();
              res.send(result);
            });
          });
    }

    
}


// retrieve and return all employees/ retrive and return a single user
exports.findEquipment = (req, res)=>{
    if(req.params.id){
        const ids = req.params.id;
        // connects to the database
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("DT");
            // checks if the collection is right and returns the one with the id sent in the request
            dbo.collection("Equipment").find({ id: ids}, function(err, result) {
              if (err) throw err;
              // closes the connection
              console.log(result.name);
              db.close();
            });
          });

    }else{
  
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("DT");
            // checks if the collection is right and returns all the documents
            dbo.collection("Equipment").find({}).toArray( function(err, result) {
              if (err) throw err;
              db.close();
              //closes the connection and sends the data
              res.send(result);
            });
          });
    }

    
}


// Update a new idetified user by user id
exports.updateEmployee = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const ids = req.params.id;
    const mo = req.file;
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        // checks if the collection is right and updates according with the request on the database
        dbo.collection("Employee").updateOne({id: ids}, { $set : { model : mo }}, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          //closes connection
          db.close();
        });
      });


        res.status(200).send( { message : "documented updated!"});
}

// Update a new idetified user by user id
exports.updateEquipment = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    

    const ids = req.params.id;
    const mo = req.file;
    //connects to database
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        var myquery = { id: ids };
        var newvalues = { $set : {model : mo} };
        // checks the collection adn updates the data by the request data
        dbo.collection("Equipment").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          //updated and closes the connection
          db.close();
        });
      });

        // sends 200 so everything was okay
        res.status(200).send( { message : "documented updated!"});
}

// Update a new idetified user by user id
exports.updateLote = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    const mo = req.file;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        var myquery = { id: id };
        var newvalues = { $set : {model : mo} };
        // checks if the collection is right and updates the document with the data from the request
        dbo.collection("Lotes").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
      });

        // sends 200 so everything is okay
        res.status(200).send( { message : "documented updated!"});
}

// Delete a employee with specified employee id in the request
exports.deleteEmployee = (req, res)=>{
    const id = req.params.id;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        var myquery = { id: id };
        //// checks if the collection is right and deletes the one document with that id
        dbo.collection("Employee").deleteOne(myquery, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          db.close();
        });
      });
      // send s 200 so everything worked correctly
      res.status(200).send( { message : "documented deleted!"});
}

// Delete a equipment with specified equipment id in the request
exports.deleteEquipment = (req, res)=>{
    const id = req.params.id;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        var myquery = { id: id };
        // checks if the collection is right and deletes the one with the id matching
        dbo.collection("Equipment").deleteOne(myquery, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          db.close();
        });
      });
      // sends 200 and a msg saying that the document was deleted
      res.status(200).send( { message : "documented deleted!"});
}

// Delete a lote with specified lote id in the request
exports.deleteLote = (req, res)=>{
    const id = req.params.id;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DT");
        var myquery = { id: id };
        // checks if the collection is right and deletes the one document witht he id
        dbo.collection("Lotes").deleteOne(myquery, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          db.close();
        });
      });
      // sends 200 to say its all good and says the documente was deleted
      res.status(200).send( { message : "documented deleted!"});
}