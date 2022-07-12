

 // create
 exports.create = (req,res)=>{
     // validate request
     if(!req.body){
         res.status(400).send({ message : "Content can not be emtpy!"});
         return;
     }
     // using the HASHMAP to check if the data that was requested is the same
     // if not then changes the information
     // redirect to the service
       res.redirect('/update-ERP');
 }
 
 // retrieve and return all users/ retrive and return a single user
 exports.find = (req, res)=>{
     if(req.params.id){
         const id = req.params.id;

         connection.execSql(request); request = new Request("Select * FROM [DigitalTwin].[dbo].[users] WHERE Id ="+id+";", function(err) {
       
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
 
     }else{
   
        connection.execSql(request); request = new Request("Select * FROM [DigitalTwin].[dbo].[users];", function(err) {
       
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
 
     
 }
 
 // Update a new idetified user by user id
 exports.update = (req, res)=>{
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