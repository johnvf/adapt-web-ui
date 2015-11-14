var mongoose = require('mongoose');

var AssetSchema = mongoose.Schema({
    name: String,
    type: String,
    width: Number,
    height: Number,
    data: String,
    tags: [ String ]
});

module.exports = mongoose.model('asset', AssetSchema);