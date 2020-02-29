export {};
const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  latestMessage: {
    type: String,
  },
  owner: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);
