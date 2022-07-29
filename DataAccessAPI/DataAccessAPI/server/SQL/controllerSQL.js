// código para fazer requests
var Request = require('tedious').Request;  
const Employee = require('./employee');
const Equipment = require('./equipment');
const Lote = require('./lote');

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


 // create and save new equipment
 exports.create = (req,res)=>{
     // validate request
     if(!req.body){
         res.status(400).send({ message : "Content can not be emtpy!"});
         return;
     }
 
     // 
     const equipment = new Equipment(
          
          req.body.sec_descritivo,
          req.body.equipmentId,
          req.body.equipmentPositionX,
          req.body.equipmentPositionY,
          req.body.equipmentPositionZ,
          req.body.equipmentDirection,
          req.body.equipmentName,
          req.body.equipmentSeriesNumber,
          req.body.equipmentModel,
          req.body.equipmentStatus,
          req.body.equipmentBrand,
          req.body.equipmentManufacturer,
          req.body.equipmentWeight,
          req.body.equipmentHeight,
          req.body.equipmentSection)

          connection = new Connection(config);
          connection.connect((err) => {
            if (err) {
              console.log('Connection Failed');
              throw err;
            }
        
 
     // save user in the database
     const request = new Request("insert into [DigitalTwin].[dbo].[equipment] (equipmentId,sec_descritivo,equipmentName,equipmentPositionX,equipmentPositionY,equipmentPositionZ, " + 
     "equipmentDirection,equipmentSeriesNumber,equipmentSection,equipmentModel,equipmentStatus,equipmentBrand,equipmentManufacturer,"+
     "equipmentWeight,equipmentHeight) VALUES ('"+equipment.equipmentId+"','"+ equipment.sec_descritivo +"','"+equipment.equipmentName+"',"+ equipment.equipmentPositionX +","+equipment.equipmentPositionY +
     ","+ equipment.equipmentPositionZ +",'"+equipment.equipmentDirection +"','"+ equipment.equipmentSeriesNumber +
     "','"+equipment.equipmentSection+"','"+ equipment.equipmentModel+"','"+equipment.equipmentStatus+"','"+ equipment.equipmentBrand+"','"+equipment.equipmentManufacturer+"',"+ equipment.equipmentWeight+","+ equipment.equipmentHeight+ ");", function(err,rowCount,row) {

      if (err) {  
        console.log(err);
    }
    });  
          
          //if there are rows write them
          request.on('row', function(columns) { 
            
                if (column.value === null) {  
                  console.log('NULL');  
                } else {  
                  console.log(columns[0].value); 
                }                        
          }
          ); 

          // after there is no more rows 
          request.on('done', function(rowCount) {  
          console.log(rowCount + ' rows returned');
          res.status(200).send( { message: "Row inserted!"});
          
          });  
          
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
              connection.close();
          });
          connection.execSqlBatch(request);

        });
         
 }


// create and save new Lote
exports.createLote = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // 
    const lote = new Lote(
      req.body.art_codigo,
      req.body.art_descritivo,
      req.body.arm_loc_pos_x,
      req.body.arm_loc_pos_y,
      req.body.arm_loc_pos_z,

    )

    

    connection = new Connection(config);
    connection.connect((err) => {
      if (err) {
        console.log('Connection Failed');
        throw err;
      }
  
         // save user in the database
    const request = new Request("insert into [DigitalTwin].[dbo].[Lotes] (art_codigo,art_descritivo,arm_loc_pos_x,arm_loc_pos_y,arm_loc_pos_z) VALUES ('"+lote.art_codigo+"','"+ lote.art_descritivo +
    "',"+lote.arm_loc_pos_x+","+ lote.arm_loc_pos_y +","+lote.arm_loc_pos_z +
    ");", function(err,rowCount,row) {
           
            if (err) {  
                console.log(err);
            }
            });  
                  
                  
                  request.on('row', function(columns) { 
                    
                        if (column.value === null) {  
                          console.log('NULL');  
                        } else {  
                          console.log(columns[0].value); 
                        }                        
                  }
                  ); 
    
                  request.on('done', function(rowCount) {  
                  console.log(rowCount + ' rows returned');
                  res.status(200).send( { message: "Row inserted!"});
                  
                  });  
                  
                  // Close the connection after the final event emitted by the request, after the callback passes
                  request.on("requestCompleted", function (rowCount, more) {
                      connection.close();
                  });
                  connection.execSqlBatch(request); 

                

                
          });
         
        
}


// create and save new Employee
exports.createEmployee = (req,res)=>{
    // validate request
    if(req.body == null){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    // object to create the employee 
    const employee = new Employee(
      req.body.em_codigo,
      req.body.em_descritivo,
      req.body.em_posx,
      req.body.em_posy,
      req.body.em_posz,
      req.body.photo,
    )

    connection = new Connection(config);
      connection.connect((err) => {
        if (err) {
          console.log('Connection Failed');
          throw err;
        }
  
         const request = new Request("insert into [DigitalTwin].[dbo].[employee] (em_codigo,em_descritivo,em_posx,em_posy,em_posz,photo) VALUES ('"+employee.em_codigo+"','"+ employee.em_descritivo +"',"+ employee.em_posx +","+ employee.em_posy +","+employee.em_posz +",'"+employee.photo +"');", function(err,rowCount,row) {
           
            if (err) {  
                console.log(err);
            }
            });  
                  
                  // while there is rows
                  request.on('row', function(columns) { 
                    
                        if (column.value === null) {  
                          console.log('NULL');  
                        } else {  
                          console.log(columns[0].value); 
                        }                        
                  }
                  ); 
                  // after there is no rows
                  request.on('done', function(rowCount) {  
                  console.log(rowCount + ' rows returned');
                  res.status(200).send( { message: "Row inserted!"});
                  
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
 exports.Lotes = (req, res)=>{
  connection = new Connection(config);
      connection.connect((err) => {
        if (err) {
          console.log('Connection Failed');
          throw err;
        }
        // gets all the lotes from adatabase
         const request = new Request("Select * FROM [DigitalTwin].[dbo].[lotes];", function(err,rowCount,row) {
           
            if (err) {  
                console.log(err);
            }
            });  
                  
                  jsonArray = []; 
                  marked = false;
                  columnArray=[];
                  //while there is rows stores them in a array to send in JSON
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
                  //after there is no more rows send the data
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
          // gets all the equipments
         const request = new Request("Select * FROM [DigitalTwin].[dbo].[equipment];", function(err,rowCount,row) {
           
            if (err) {  
                console.log(err);
            }
            });  
                  
            jsonArray = []; 
            marked = false;
            columnArray=[];
            // while there is rows save them in a aarray to send as JSON
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
                  //when there is no more rows sends the data
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
 exports.Employee = (req, res)=>{
  connection = new Connection(config);
     
      connection.connect((err) => {
        if (err) {
          console.log('Connection Failed');
          throw err;
        }

         const request = new Request("Select * FROM [DigitalTwin].[dbo].[employee] ;", function(err,rowCount,row) {
           
            if (err) {  
                console.log(err);
            }
            });  
                  
            jsonArray = []; 
            marked = false;
            columnArray=[];
//while there is rows save them in aarray to send as JSON
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
                  // after all the rows sends the data
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
     if(!req.body){
         return res
             .status(400)
             .send({ message : "Data to update can not be empty"})
     }
      var s = req.body;
      var arr = [];
      //usar estas keys para fazer o update
      Object.values(s).forEach( element => {
        arr.push(element);
     })
     let values = "";
     var count = 0;
     // making the string for the query with the data from the request
     Object.keys(s).forEach( element => {
        values+= element + "=' " + arr[count]+ "' , ";
        count++;
     })
      values = values.substring(0, values.length-2);

     const id = req.params.id;
     connection = new Connection(config);
     
     connection.connect((err) => {
       if (err) {
         console.log('Connection Failed');
         throw err;
       }
       // update query
        const request = new Request("Update [DigitalTwin].[dbo].[equipment] SET " + values + " WHERE equipmentId ="+ id+";", function(err,rowCount,row) {
          
           if (err) {  
               console.log(err);
           }
           });  
                 
           
           request.on('row', function(columns) { 
             
             
               columns.forEach(function(column) { 
                 if (column.value === null) {  
                   console.log('NULL');  
                 } else {  
                   results+= column.value + " ";  
                 }  
               });  
               
                 }
                 ); 
   
                 request.on('done', function(rowCount) {  
                 console.log(rowCount + ' rows returned');
                 res.status(200).send( { message : "Updated row"});
                 
                 });  
                 
                 // Close the connection after the final event emitted by the request, after the callback passes
                 request.on("requestCompleted", function (rowCount, more) {
                     connection.close();
                 });
                 connection.execSqlBatch(request); 

               

               
         });
 }

  // Update a new idetified user by user id
  exports.updateEmployee = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
     var s = req.body;
     var arr = [];
     //usar estas keys para fazer o update
     Object.values(s).forEach( element => {
       arr.push(element);
    })
    let values = "";
    var count = 0;
    // creating the string for the query with the data from request
    Object.keys(s).forEach( element => {
       values+= element + "=' " + arr[count]+ "' , ";
       count++;
    })
     values = values.substring(0, values.length-2);

    const id = req.params.id;
    connection = new Connection(config);
    
    connection.connect((err) => {
      if (err) {
        console.log('Connection Failed');
        throw err;
      }
       const request = new Request("Update [DigitalTwin].[dbo].[employee] SET " + values + " WHERE em_codigo ="+ id+";", function(err,rowCount,row) {
         
          if (err) {  
              console.log(err);
          }
          });  
                
          
          request.on('row', function(columns) { 
            
            
              columns.forEach(function(column) { 
                if (column.value === null) {  
                  console.log('NULL');  
                } else {  
                  results+= column.value + " ";  
                }  
              });  
              
                }
                ); 
  
                request.on('done', function(rowCount) {  
                console.log(rowCount + ' rows returned');
                res.status(200).send( { message : "Updated row"});
                
                });  
                
                // Close the connection after the final event emitted by the request, after the callback passes
                request.on("requestCompleted", function (rowCount, more) {
                    connection.close();
                });
                connection.execSqlBatch(request); 

              

              
        });
}

 // Update a new idetified user by user id
 exports.updateLotes = (req, res)=>{
  if(!req.body){
      return res
          .status(400)
          .send({ message : "Data to update can not be empty"})
  }
   var s = req.body;
   var arr = [];
   //usar estas keys para fazer o update
   Object.values(s).forEach( element => {
     arr.push(element);
  })
  let values = "";
  var count = 0;
  // creating the string for the query with the data for the query
  Object.keys(s).forEach( element => {
     values+= element + "=' " + arr[count]+ "' , ";
     count++;
  })
   values = values.substring(0, values.length-2);

  const id = req.params.id;
  connection = new Connection(config);
  
  connection.connect((err) => {
    if (err) {
      console.log('Connection Failed');
      throw err;
    }
    
     const request = new Request("Update [DigitalTwin].[dbo].[Lotes] SET " + values + " WHERE art_codigo ="+ id+";", function(err,rowCount,row) {
       
        if (err) {  
            console.log(err);
        }
        });  
              
        
        request.on('row', function(columns) { 
          
          
            columns.forEach(function(column) { 
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                results+= column.value + " ";  
              }  
            });  
            
              }
              ); 

              request.on('done', function(rowCount) {  
              console.log(rowCount + ' rows returned');
              res.status(200).send( { message : "Updated row"});
              
              });  
              
              // Close the connection after the final event emitted by the request, after the callback passes
              request.on("requestCompleted", function (rowCount, more) {
                  connection.close();
              });
              connection.execSqlBatch(request); 

            

            
      });
}

 
 // Delete a employee with specified employee id in the request
 exports.deleteEmployee = (req, res)=>{
  const id = req.params.id;

  connection = new Connection(config); 
  connection.connect((err) => {
    if (err) {
      console.log('Connection Failed');
      throw err;
    }
      // delete query for the id form the request
     const request = new Request("DELETE FROM [DigitalTwin].[dbo].[employee] WHERE em_codigo ='"+id+"';", function(err) {
       
      if (err) {  
        console.log(err);
    }
    });  
          
    request.on('row', function(columns) { 
      
      
        columns.forEach(function(column) {           
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            console.log(column.value); 
          }  
        });  
       
          }
          ); 

          request.on('done', function(rowCount) {  
          console.log(rowCount + ' rows returned');
          res.status(200).send( {message: "Employee removed"});
          
          });  
          
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
              connection.close();
          });
          connection.execSqlBatch(request); 

        

        
  });
 }


  // Delete a Lote with specified Lote id in the request
  exports.deleteLote = (req, res)=>{
    const id = req.params.id;
  
    connection = new Connection(config); 
    connection.connect((err) => {
      if (err) {
        console.log('Connection Failed');
        throw err;
      }
      // delete query for the id form the request
       const request = new Request("DELETE FROM [DigitalTwin].[dbo].[Lotes] WHERE art_codigo ='"+id+"';", function(err) {
         
        if (err) {  
          console.log(err);
      }
      });  
            
      request.on('row', function(columns) { 
        
        
          columns.forEach(function(column) {           
            if (column.value === null) {  
              console.log('NULL');  
            } else {  
              console.log(column.value); 
            }  
          });  
         
            }
            ); 
  
            request.on('done', function(rowCount) {  
            console.log(rowCount + ' rows returned');
            res.status(200).send( {message: "Lote removed"});
            
            });  
            
            // Close the connection after the final event emitted by the request, after the callback passes
            request.on("requestCompleted", function (rowCount, more) {
                connection.close();
            });
            connection.execSqlBatch(request); 
  
          
  
          
    });
   }


   // Delete a equpment with specified equipment id in the request
  exports.deleteEquipment = (req, res)=>{
    const id = req.params.id;
  
    connection = new Connection(config); 
    connection.connect((err) => {
      if (err) {
        console.log('Connection Failed');
        throw err;
      }
      // delete query from the id from the request
       const request = new Request("DELETE FROM [DigitalTwin].[dbo].[equipment] WHERE equipmentId ='"+id+"';", function(err) {
         
        if (err) {  
          console.log(err);
      }
      });  
            
      request.on('row', function(columns) { 
        
        
          columns.forEach(function(column) {           
            if (column.value === null) {  
              console.log('NULL');  
            } else {  
              console.log(column.value); 
            }  
          });  
         
            }
            ); 
  
            request.on('done', function(rowCount) {  
            console.log(rowCount + ' rows returned');
            res.status(200).send( {message: "Equipment removed"});
            
            });  
            
            // Close the connection after the final event emitted by the request, after the callback passes
            request.on("requestCompleted", function (rowCount, more) {
                connection.close();
            });
            connection.execSqlBatch(request); 
  
          
  
          
    });
   }

 