const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config( { path : 'config.env'} )





 // create and save new user
 exports.create = (req,res)=>{
     // validate request
     
     const client = new InfluxDB({url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: process.env.INFLUX_TOKEN})
 
 
     // save user in the database
     const writeApi = client.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET)

      writeApi.useDefaultTags({host: 'host1'})

      const point = new Point('mem').floatField('used_percent', 23.43234543)
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
 exports.find = (req, res)=>{   
    const client = new InfluxDB({url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: process.env.INFLUX_TOKEN})
    const queryApi = client.getQueryApi(process.env.INFLUX_ORG);
    const array = [];
    const query = `from(bucket: "MyDB") |> range(start: -1h)`
    queryApi.queryRows(query, {
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
 exports.update = (req, res)=>{
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