const mongoose = require('mongoose');
const { body } = require('express-validator');

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

const references = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
};

const project = new Schema({ ...fields, ...references }, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
});

const virtuals = {
  tasks: {
    ref: 'task',
    localField: '_id',
    foreignField: 'projectId',
  },
};

project.virtual('tasks', virtuals.tasks);

const sanitizers = [body('title').escape(), body('description').escape()];

module.exports = {
  Model: mongoose.model('project', project),
  fields,
  references,
  virtuals,
  sanitizers,
};
