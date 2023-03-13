const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const productCollection = 'product'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    status: Boolean,
    category: String,
})
productSchema.plugin(mongoosePaginate)
const Product = mongoose.model(productCollection, productSchema)

module.exports = Product