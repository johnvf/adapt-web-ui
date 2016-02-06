var mongoose = require('mongoose');

var PlantListSchema = mongoose.Schema({
    name: String,
    index: Number,
    slug: String,
    type: String,
    data: [ { } ],
    tags: [ String ]
});

module.exports = mongoose.model('plantList', PlantListSchema);