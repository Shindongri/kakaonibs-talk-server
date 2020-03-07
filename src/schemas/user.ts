export {}
const mongoose = require('mongoose')
const { v4 } = require('uuid')

const { Schema } = mongoose
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    default: v4(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', userSchema)
