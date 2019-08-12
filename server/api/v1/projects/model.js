const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 128,
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: 256,
  },
};

const project = new Schema(fields, {
  timestamps: true,
});

module.exports = {
  Model: mongoose.model('project', project),
  fields,
};
