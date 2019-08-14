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

module.exports = {
  Model: mongoose.model('project', project),
  fields,
  references,
  virtuals,
};
