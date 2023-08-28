const mongoose = require("mongoose");

const tabletSchema = mongoose.Schema({
    code: { type: String, required: true },
    capacity: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    isTaken: { type: Boolean, default: false },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
})

module.exports = mongoose.model("Table", tabletSchema);