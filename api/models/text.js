var mongoose = require('mongoose');

var TextSchema = mongoose.Schema({
    name: String,
    data: String,
    tags: [ String ]
});

module.exports = mongoose.model('text', TextSchema);