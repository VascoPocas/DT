const {InfluxDB} = require('@influxdata/influxdb-client')
    
// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'yXsVg3ulI7HEA-mWvM8g-HmMwRyFncbBitAHNKSRfHU1kNJ-E-lDc1ejHoacMPz666Q0DXLfHaOYEtXCNR-HZQ=='


 const connectDB2 = async () => {

     try{
      
      const client = new InfluxDB({url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: token})
         
      return client;

    }
    catch(err){
      console.log(err);
      process.exit(2); 
    }
}




module.exports = connectDB2 