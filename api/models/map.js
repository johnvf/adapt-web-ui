var mongoose = require('mongoose');

var MapSchema = mongoose.Schema({
    name: String,
    type: String,
    width: Number,
    height: Number,
    layers: {},
    tags: [ String ]
});

module.exports = mongoose.model('map', MapSchema);