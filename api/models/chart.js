var mongoose = require('mongoose');

var ChartSchema = mongoose.Schema({
    name: String,
    type: String,
    config: { },
    data: [ { } ],
    tags: [ String ]
});

module.exports = mongoose.model('chart', ChartSchema);