const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    price: { type: Number },
    isPaid: { type: Boolean, default: false },
    isReady: { type: Boolean, default: false },
    date: { type: String },
    time: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orderedProducts: [],
    waiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' },
    confirmed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
})


module.exports = mongoose.model("Order", orderSchema);

// const mongoose = require("mongoose");

// const orderSchema = mongoose.Schema({
//     price: { type: Number },
//     isPaid: { type: Boolean, default: false },
//     date: { type: String },
//     time: { type: String },
//     extras: [
//         {
//             extras_id: { type: mongoose.Schema.Types.ObjectId, ref: "Extras" },
//             product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//         }
//     ],
//     products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
//     waiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' },
//     confirmed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' },
//     table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
//     restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
// })

// module.exports = mongoose.model("Order", orderSchema);
