var mongoose = require('mongoose');

var MapSchema = mongoose.Schema({
    name: String,
    layers: {},
    tags: [ String ]
});

module.exports = mongoose.model('map', MapSchema);