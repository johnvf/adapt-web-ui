var mongoose = require('mongoose');

var MapStyleSchema = mongoose.Schema({
    name: String,
    data: {},
});

module.exports = mongoose.model('mapstyle', MapStyleSchema);