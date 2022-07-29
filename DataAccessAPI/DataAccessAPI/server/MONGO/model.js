const mongoose = require('mongoose');
// schema for the documents in the database
var schema = new mongoose.Schema({
    id : {
        type : String,
        required: true
    },
    model : {
        type : Object,
        required : true
    }
})

const Model = mongoose.model('model', schema);

module.exports = Model;