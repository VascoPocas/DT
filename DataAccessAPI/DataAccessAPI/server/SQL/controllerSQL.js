// código para fazer requests
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
//var connection = require('./connectionSQL'); 
const { json } = require('body-parser');
const User = require('./modelSql');

var Connection = require('tedious').Connection;  
    var config = {  
        server: "SISTRADEINOV",  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'vpo', //update me
                password: 'vpo'  //update me
            }
        },
        options: {
            database: 'DigitalTwin',  //update me
            rowCollectionOnDone: true,
            useColumnNames: false
        }
    };  
    var connection; 


 // create and save new user
 exports.create = (req,res)=>{
   connection = new Connection(config);
     // validate request
     if(!req.body){
         res.status(400).send({ message : "Content can not be emtpy!"});
         return;
     }
 
     // 
     const user = new User({
         name : req.body.name
     })
 
     // save user in the database
     request = new Request("insert into [DigitalTwin].[dbo].[users] (name) VALUES ('"+ user.Name +"');", function(err,rowCount,row) {

        if (err) {  
            console.log(err);}  
        });  
        var result = "";

        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result+= column.value + " ";  
              }  
            });  
            console.log(result);  
            result ="";  
        });  
    
        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          db.connection.close();
        });
         
 }

 var results = [];
 // retrieve and return all users/ retrive and return a single user
 exports.Lotes = (req, res)=>{
  connection = new Connection(config);
      connection.connect((err) => {
        if (err) {
          console.log('Connection Failed');
          throw err;
        }
  
         const request = new Request("Select * FROM [DigitalTwin].[dbo].[lotes];", function(err,rowCount,row) {
           
            if (err) {  
                console.log(err);
            }
            });  
                  
                  jsonArray = []; 
                  marked = false;
                  columnArray=[];
                  request.on('row', function(columns) { 
                    var rowObject ={}; 
                    
                      columns.forEach(function(column) { 
                        rowObject[column.metadata.colName] = column.value;
                        
                        columnArray.forEach( name => {
                          if(name == column.metadata.colName){
                            marked =true;
                          }
                        })
                        if(marked == false){
                        columnArray.push(column.metadata.colName);
                          
                      }else{
                        marked =false;
                      }
                        if (column.value === null) {  
                          console.log('NULL');  
                        } else {  
                          results+= column.value + " ";  
                        }  
                      });  
                      
                      rowObject["columns"] = columnArray;
                      
                      jsonArray.push(rowObject);
                     
                       
                  }
                  ); 
    
                  request.on('done', function(rowCount) {  
                  console.log(rowCount + ' rows returned');
                  res.send(jsonArray);
                  
                  });  
                  
                  // Close the connection after the final event emitted by the request, after the callback passes
                  request.on("requestCompleted", function (rowCount, more) {
                      connection.close();
                  });
                  connection.execSqlBatch(request); 

                

                
          });
     
 }




 
 var results = [];
 // retrieve and return all users/ retrive and return a single user
 exports.find = (req, res)=>{
  connection = new Connection(config);
     
      connection.connect((err) => {
        if (err) {
          console.log('Connection Failed');
          throw err;
        }
  
         const request = new Request("Select * FROM [DigitalTwin].[dbo].[equipment];", function(err,rowCount,row) {
           
            if (err) {  
                console.log(err);
            }
            });  
                  
            jsonArray = []; 
            marked = false;
            columnArray=[];
            request.on('row', function(columns) { 
              var rowObject ={}; 
              
                columns.forEach(function(column) { 
                  rowObject[column.metadata.colName] = column.value;
                  
                  columnArray.forEach( name => {
                    if(name == column.metadata.colName){
                      marked =true;
                    }
                  })
                  if(marked == false){
                  columnArray.push(column.metadata.colName);
                    
                }else{
                  marked =false;
                }
                  if (column.value === null) {  
                    console.log('NULL');  
                  } else {  
                    results+= column.value + " ";  
                  }  
                });  
                
                rowObject["columns"] = columnArray;
                
                jsonArray.push(rowObject);
               
                  }
                  ); 
    
                  request.on('done', function(rowCount) {  
                  console.log(rowCount + ' rows returned');
                  res.send(jsonArray);
                  
                  });  
                  
                  // Close the connection after the final event emitted by the request, after the callback passes
                  request.on("requestCompleted", function (rowCount, more) {
                      connection.close();
                  });
                  connection.execSqlBatch(request); 

                

                
          });
     
 }

 
 // Update a new idetified user by user id
 exports.update = (req, res)=>{
  connection = new Connection(config);
     if(!req.body){
         return res
             .status(400)
             .send({ message : "Data to update can not be empty"})
     }
 
     const id = req.params.id;
     connection.execSql(request); request = new Request("UPDATE [DigitalTwin].[dbo].[users] SET Name = "+ req.body.Name +";", function(err) {
       
        if (err) {  
            console.log(err);}  
        });  
        var result = "";  
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result+= column.value + " ";  
              }  
            });  
            console.log(result);  
            result ="";  
        });  
    
        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request); 
 }
 
 // Delete a user with specified user id in the request
 exports.delete = (req, res)=>{
    connection = new Connection(config);
     const id = req.params.id;
 
     connection.execSql(request); request = new Request("DELETE FROM [DigitalTwin].[dbo].[users] WHERE Id ="+id+";", function(err) {
       
        if (err) {  
            console.log(err);}  
        });  
        var result = "";  
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result+= column.value + " ";  
              }  
            });  
            console.log(result);  
            result ="";  
        });  
    
        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request); 
 }


 