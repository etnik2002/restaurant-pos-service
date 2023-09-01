const moment = require("moment");
const Order = require("../models/Order");

module.exports = {

    createOrder: async (req,res) => {
        try {
            const cart = req.body.cart;
            let products = [];
            let price = 0;
            cart.map((item) => {
                products.push(item._id);
                price += item.price;
            })

            const newOrder = new Order({
                products: products,
                waiter: req.body.waiter,
                table: req.body.table,
                restaurant_id: req.params.restaurant_id,
                price: price,
                date: moment(new Date()).format('DD-MM-YYYY'),
                time: moment(new Date()).format('hh:mm'),
            })

            await newOrder.save();
            return res.status(201).json("Order placed");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getOrderById: async (req,res) => {
        try {
            const order = await Order.aggregate([{ $match: { _id: req.params.id, restaurant_id: req.params.restaurant_id } }]);
            return res.status(200).json(order[0]);            
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },




}