const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const restaurantSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    access: { type: String },
    trialDate: { type: String, },
    printers: [
        {
            name: {
                type: String
            },
            location: {
                type: String
            },
            interface: {
                type: String,
            },
            connection: {
                type: String,
            }
        }
    ],
    isActive: { type: Boolean, },
    plan: { type: String, required: true },
    isSetup: { type: Boolean, default: false },
    currency: { type: String },
    receipt: {
        useLogo: { type: Boolean },
        header: { type: String },
        footer: { type: String },
    },
    ip: { type: String },
})

restaurantSchema.methods.generateAuthToken = function (data) {
    data.password = undefined;
    const token = jwt.sign({ data }, process.env.OUR_SECRET, {
        expiresIn: '365d',
    });

    return token;
};


module.exports = mongoose.model("Restaurant", restaurantSchema);