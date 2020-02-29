export {};
const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  thumbnailURL: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
