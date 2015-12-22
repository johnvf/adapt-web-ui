var mongoose = require('mongoose');

var TextSchema = mongoose.Schema({
    name: String,
    index: Number,
    data: String,
    tags: [ String ]
});

module.exports = mongoose.model('text', TextSchema);