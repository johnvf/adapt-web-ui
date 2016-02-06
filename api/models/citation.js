var mongoose = require('mongoose');

var CitationSchema = mongoose.Schema({
    name: String,
    index: Number,
    slug: String,
    type: String,
    data: [ { } ],
    tags: [ String ]
});

module.exports = mongoose.model('citation', CitationSchema);