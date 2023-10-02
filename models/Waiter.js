const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const waiterSchema = mongoose.Schema({
    name: { type: String },
    pin: { type: Number },
    role: { type: String },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
})

waiterSchema.methods.generateAuthToken = function (data) {
    data.password = undefined;
    const token = jwt.sign({ data }, process.env.OUR_SECRET);

    return token;
};


module.exports = mongoose.model("Waiter", waiterSchema);