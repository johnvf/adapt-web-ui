'use strict';

var mongoose = require('mongoose'),
    user = mongoose.model('user');

exports.all = function(req, res) {
  user.find({}, function(err, users) {
    if(err) {
      res.send(400);
    }
    res.send(users);
  });
};
