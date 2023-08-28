// restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

const mongoose = require("mongoose");

const floorSchema = mongoose.Schema({
    name: { type: String },
    tables: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
})

module.exports = mongoose.model("Floor", floorSchema);