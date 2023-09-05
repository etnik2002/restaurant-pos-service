const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    pin: { type: Number },
    role: {
        type: String,
        enum: ['ceo', 'manager', 'supervisor'],
    },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
})

userSchema.methods.generateAuthToken = function (data) {
    data.password = undefined;
    const token = jwt.sign({ data }, process.env.OUR_SECRET, {
        expiresIn: '365d',
    });

    return token;
};


module.exports = mongoose.model("User", userSchema);