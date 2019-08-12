const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 128,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 128,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 128,
    unique: true,
  },
  profilePhoto: {
    type: String,
    trim: true,
    default: '',
  },
};

const user = new Schema(fields, {
  timestamps: true,
});

module.exports = {
  Model: mongoose.model('user', user),
  fields,
};
