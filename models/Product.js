// restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
})


module.exports = mongoose.model("Product", productSchema);