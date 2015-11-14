var mongoose = require('mongoose');

var TabularSchema = mongoose.Schema({
    name: String,
    type: String,
    chart_type: { },
    xAxis: String,
    yAxis: String,
    data: [ { } ],
    tags: [ String ]
});

module.exports = mongoose.model('tabular', TabularSchema);