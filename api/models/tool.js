var mongoose = require('mongoose');

var ToolSchema = mongoose.Schema({
    name: String,
    index: Number,
    tags: [ String ]
});

module.exports = mongoose.model('tool', ToolSchema);