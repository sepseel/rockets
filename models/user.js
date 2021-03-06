const {Schema, model } = require('mongoose');

const UserSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    default: '/img/user.jpg',
  },
});

const User = model('user', UserSchema);
module.exports = User;
