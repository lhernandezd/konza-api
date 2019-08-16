const mongoose = require('mongoose');
const { hash, compare } = require('bcryptjs');
const { isEmail, isURL } = require('validator');

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
    validate: {
      validator(value) {
        return isEmail(value);
      },
      message(props) {
        return `${props.value} is not a valid Email`;
      },
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  profilePhoto: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator(value) {
        return isURL(value);
      },
      message(props) {
        return `${props.value} is not a URL`;
      },
    },
  },
};

const user = new Schema(fields, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
});

user
  .virtual('fullname')
  .get(
    // prettier-ignore
    function getName() {
      return `${this.firstname} ${this.lastname}`;
    },
  )
  .set(
    // prettier-ignore
    function setName(fullname) {
      const [firstname = '', lastname = ''] = fullname.split(' ');
      this.firstname = firstname;
      this.lastname = lastname;
    },
  );

const blackListFields = ['password'];

// prettier-ignore
user.methods.toJSON = function toJSON() {
  const document = this.toObject();
  blackListFields.forEach((field) => {
    delete document[field];
  });
  return document;
};

// prettier-ignore
user.pre('save', async function save(next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

// prettier-ignore
user.methods.verifyPassword = function verifyPassword(password) {
  return compare(password, this.password);
};

module.exports = {
  Model: mongoose.model('user', user),
  fields,
};
