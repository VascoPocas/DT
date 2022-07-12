const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    }
})

const Userdb = mongoose.model('user', schema,'sample');

module.exports = Userdb;