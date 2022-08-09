const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const LoginDataError = require('../errors/login-data-error');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      validate: {
        validator(v) {
          return /^http(s)?:\/\/(www.)?([\w-]+\.)+\/?\S*$/.test(v);
        },
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new LoginDataError('Неправильные почта или пароль!');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new LoginDataError('Неправильные почта или пароль!');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
