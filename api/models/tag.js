var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
    name: String,
    type: String
});

module.exports = mongoose.model('tag', TagSchema);