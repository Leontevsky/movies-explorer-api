const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
module.exports = mongoose.model("user", UserSchema);

// const mongoose = require('mongoose');
// const emailValidator = require('validator/lib/isEmail');
// // Схема это часть от Могуса.
// const { Schema } = mongoose;

// const userSchema = new Schema({
//   name: {
//     type: String,
//     require: true,
//     minlenght: 2,
//     maxlenght: 30,
//   },

//   email: {
//     type: String,
//     unique: true,
//     require: true,
//     validate: {
//       validator: (v) => emailValidator(v),
//       message: 'Неправильный формат почты',
//     }, // пустой
//   },
//   password: {
//     type: String,
//     require: true,
//     select: false, // что бы не показывал и не возвращал пароль
//   },
// });

// module.exports = mongoose.model('user', userSchema);
