const moment = require("moment");
const Order = require("../models/Order");

module.exports = {

    createOrder: async (req,res) => {
        try {
            const newOrder = new Order({
                price: req.body.price,
                extras: req.body.extras || null,
                products: req.body.products,
                waiter: req.body.waiter,
                table: req.body.table,
                restaurant_id: req.body.restaurant_id,
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