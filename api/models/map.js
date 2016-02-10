var mongoose = require('mongoose');

var MapSchema = mongoose.Schema({
    name: String,
    legend_text: String,
    index: Number,
    default: Number,
    heading: Number,
    sources: {},
    layers: {},
    tags: [ String ]
});

module.exports = mongoose.model('map', MapSchema);