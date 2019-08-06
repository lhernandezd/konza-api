const mongoose = require('mongoose');

const task = {
  title: String,
  description: String,
};

module.exports = mongoose.model('task', task);
