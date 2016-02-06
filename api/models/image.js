var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
    name: String,
    index: Number,
    slug: String,
    tags: [ String ],
    public_id: String,
    format: String,
    version: Number,
    resource_type: String,
    type: String,
    created_at: String,
    bytes: Number,
    width: Number,
    height: Number,
    url: String,
    caption: String,
    secure_url: String
});

module.exports = mongoose.model('image', ImageSchema);