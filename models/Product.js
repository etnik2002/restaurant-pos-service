// restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    tax: { type: Number },
    sales: { type: Number },
    stock: { type: Number },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
})


module.exports = mongoose.model("Product", productSchema);