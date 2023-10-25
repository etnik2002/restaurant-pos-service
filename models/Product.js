// restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    tax: { type: Number },
    note: { type: String },
    stock: { type: Number },
    image: { type: String },
    ingredients: [],
    trackStock: { type: Boolean },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
})


module.exports = mongoose.model("Product", productSchema);