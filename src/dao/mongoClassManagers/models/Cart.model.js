const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          
        },
        quantity: {
          type: Number,
          default: 0
        }
      }
    ],
    default: [],
    _id: false
  }
})

cartSchema.pre('find', function () {
  this.populate('products.product')
  this.select(['products', 'quantity'])
})
cartSchema.plugin(mongoosePaginate)
const Cart = mongoose.model(cartCollection, cartSchema)

module.exports = Cart