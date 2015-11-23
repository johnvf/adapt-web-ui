var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
    text: String,
    type: String
});

module.exports = mongoose.model('tag', TagSchema);