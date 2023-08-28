// restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

const mongoose = require("mongoose");

const extrasSchema = mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
})

module.exports = mongoose.model("Extras", extrasSchema);