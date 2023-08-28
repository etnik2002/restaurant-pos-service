const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
})

restaurantSchema.methods.generateAuthToken = function (data) {
    data.password = undefined;
    const token = jwt.sign({ data }, process.env.OUR_SECRET, {
        expiresIn: '365d',
    });

    return token;
};


module.exports = mongoose.model("Restaurant", restaurantSchema);