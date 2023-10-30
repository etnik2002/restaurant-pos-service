const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    price: { type: Number },
    isPaid: { type: Boolean, default: false },
    isReady: { type: Boolean, default: false },
    type: { type: String },
    paymentType: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orderedProducts: [],
    waiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' },
    confirmed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    date: { type: String },
}, { timestamps: true } )


module.exports = mongoose.model("Order", orderSchema);
