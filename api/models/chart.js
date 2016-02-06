var mongoose = require('mongoose');

var ChartSchema = mongoose.Schema({
    name: String,
    index: Number,
    slug: String,
    type: String,
    config: { },
    data: [ { } ],
    caption: String,
    tags: [ String ]
});

module.exports = mongoose.model('chart', ChartSchema);