const Order = require("../models/Order");
const Waiter = require("../models/Waiter");

module.exports = {

    createWaiter: async (req,res) => {
        try {
            const newWaiter = new Waiter({
                name: req.body.name,
                pin: req.body.pin,
                restaurant_id: req.params.restaurant_id,
            })

            await newWaiter.save();
            return res.status(201).json("waiter created !");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    login: async (req,res) => {
        try {
            const waiter = await Waiter.findOne({ restaurant_id: req.params.restaurant_id, pin: req.body.pin });
            if(!waiter) {
                return res.status(404).json("This waiter was not found!");
            }

            const validPin = req.body.pin === waiter.pin;
            if(!validPin) {
                return res.status(401).json({ data: null, message: "Invalid  PIN" });
            }

            const token = waiter.generateAuthToken(waiter);
            return res.status(200).json({data: token, message: "Successfull login"});

        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getWaiterById: async (req,res) => {
        try {
            const waiter = await Waiter.aggregate([{ $match: {_id: req.params.id, restaurant_id: req.params.restaurant_id }}]);
            return res.status(200).json(waiter[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getWaiterOrders: async (req,res) => {
        try {
            const orders = await Order.aggregate([{ $match: { restaurant_id: req.params.restaurant_id, waiter: req.params.waiter_id } }])
            return res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },


}