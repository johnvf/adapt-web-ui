var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
    text: {type: String, required: true},
    type: {type: String, required: true},
    index: Number
});

module.exports = mongoose.model('tag', TagSchema);
