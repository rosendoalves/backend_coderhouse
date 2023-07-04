const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const ticketCollection = 'ticket'

const ticketSchema = new mongoose.Schema({
    code:{
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: String
    },
    amount: {
        type: Number
    },
    purchaser: {
        type: String
    },
    products: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
          }
        ],
        default: [],
        _id: false
      }
})

ticketSchema.plugin(mongoosePaginate)
const Ticket = mongoose.model(ticketCollection, ticketSchema)

module.exports = Ticket