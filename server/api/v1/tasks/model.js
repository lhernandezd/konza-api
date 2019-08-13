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

module.exports = {
  Model: mongoose.model('task', task),
  fields,
  references,
};
