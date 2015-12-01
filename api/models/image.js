var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
    name: String,
    type: String,
    width: Number,
    height: Number,
    data: String,
    tags: [ String ]
});

module.exports = mongoose.model('image', ImageSchema);