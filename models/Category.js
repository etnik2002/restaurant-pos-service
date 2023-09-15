// restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: { type: String },
    tax: { type: Number },
    image: { type: String },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
})

module.exports = mongoose.model("Category", categorySchema);