const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const { route } = require('./server/routes/router');
const { Router } = require('express');


const app = express();

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 5000

// log requests
app.use(morgan('tiny'));


// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// load routers
app.use('/', require('./server/routes/router'))

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});