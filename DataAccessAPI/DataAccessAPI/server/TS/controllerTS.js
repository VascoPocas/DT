const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config( { path : 'config.env'} )





 // create and save new user
 exports.create = async (req,res)=>{
     // validate request
     //connectiont to the database
     const client = new InfluxDB({url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: process.env.INFLUX_TOKEN})
 
 
     // save user in the database
     const writeApi = client.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET)
      // host
      writeApi.useDefaultTags({host: 'host1'})
      // create new data here with value of the request
      const point = new Point('mem').intField('value_temperature', req.params.value)
      writeApi.writePoint(point)
 
      writeApi
          .close()
          .then(() => {
              console.log('FINISHED')
          })
    .catch(e => {
        console.error(e)
        console.log('Finished ERROR')
    })
         
 }
 
 // retrieve and return all users/ retrive and return a single user
 exports.find = async (req, res)=>{   
    const client = new InfluxDB({url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: process.env.INFLUX_TOKEN})
    const queryApi = client.getQueryApi(process.env.INFLUX_ORG);
    const array = [];
    // query to get last points from 5 sec ago
    const query = `from(bucket: "MyDB") |> range(start: -5s)`
    queryApi.queryRows(query, {
      // wrtie the value in the console
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row)
        array.push(o);
        console.log(`${o._time} ${o._measurement}: ${o._field}=${o._value}`)
      },
      error: (error) => {
        console.error(error)
        console.log('Finished ERROR')
      },
      complete: () => {
        res.send(array);
        console.log('Finished SUCCESS')
      },
    })

    
 
     
 }
 
 // Update a new idetified user by user id
 exports.update = async (req, res)=>{
     if(!req.body){
         return res
             .status(400)
             .send({ message : "Data to update can not be empty"})
     }
 
     const id = req.params.id;
    
 }
 
 // Delete a user with specified user id in the request
 exports.delete = (req, res)=>{
     const id = req.params.id;
 
     
 }