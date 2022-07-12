
const connectDB3 = async () => {

    try{
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
            database: 'DigitalTwin'  //update me
        }
    };  
    const connection = new Connection(config);  
    connection.on("connect", function (err) {
      if(err) {
        console.log('Error: ', err)
      } else {
        console.log("Successful connection");
      }
    });
    
    connection.connect();

    }
    catch(err){
      console.log(err);
      process.exit(2); 
    }
  }





module.exports = connectDB3