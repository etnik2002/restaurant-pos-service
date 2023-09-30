// restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
    name: { type: String },
    stock: { type: Number },
    type: { type: String },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }
})

module.exports = mongoose.model("Ingredient", ingredientSchema);