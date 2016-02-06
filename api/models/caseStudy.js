var mongoose = require('mongoose');

var CaseStudySchema = mongoose.Schema({
    name: String,
    index: Number,
    slug: String,
    type: String,
    data: [ { } ],
    tags: [ String ]
});

module.exports = mongoose.model('caseStudy', CaseStudySchema);