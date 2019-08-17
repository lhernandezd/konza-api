const mongoose = require('mongoose');
const { body, sanitizeBody } = require('express-validator');

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
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    default: null,
  },
};

const references = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'project',
  },
};

const task = new Schema({ ...fields, ...references }, {
  timestamps: true,
});

const sanitizers = [
  body('title').escape(),
  body('description').escape(),
  sanitizeBody('completed').toBoolean(),
  body('dueDate').toDate(),
];

module.exports = {
  Model: mongoose.model('task', task),
  fields,
  references,
  sanitizers,
};
