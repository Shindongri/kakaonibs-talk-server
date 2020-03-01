export {};
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const roomSchema = new Schema({
  title: {
    type: String
  },
  opponent: {
    type: ObjectId,
    ref: 'User'
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
