var mongoose = require('mongoose');

var TableSchema = mongoose.Schema({
    name: String,
    index: Number,
    slug: String,
    type: String,
    chart_type: { },
    xAxis: String,
    yAxis: String,
    data: [ { } ],
    tags: [ String ]
});

module.exports = mongoose.model('table', TableSchema);