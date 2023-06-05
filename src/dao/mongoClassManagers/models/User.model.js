const mongoose = require('mongoose')

const userCollection = 'user'

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  cart:   {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'cart',
    },
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'PREMIUM'],
    default: 'USER',
  },

})

const User = mongoose.model(userCollection, userSchema)

module.exports = User