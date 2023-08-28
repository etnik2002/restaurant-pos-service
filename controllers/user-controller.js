const Order = require("../models/Order");
const User = require("../models/User");

module.exports = {

    createUser: async (req,res) => {
        try {
            const newUser = new User({
                name: req.body.name,
                pin: req.body.pin,
                role: req.body.role,
            })
            await newUser.save(); 
            return res.status(201).json(`${req.body.role} created`);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`);    
        }
    },

    findUserById: async (req,res) => {
        try {
            const user = await User.aggregate([{ $match: { _id: req.params.id, restaurant_id: req.params.restaurant_id } }])
            return res.status(200).json(user[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getAllManagers: async(req,res) => {
        try {
            const managers = await User.aggregate([{ $match: { role: 'manager', restaurant_id: req.params.restaurant_id } }])
            return res.status(200).json(managers);   
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getAllSupervisors: async(req,res) => {
        try {
            const supervisors = await User.aggregate([{ $match: { role: 'supervisor', restaurant_id: req.params.restaurant_id } }])
            return res.status(200).json(supervisors);   
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    deleteUser: async (req,res) => {
        try {
            await User.findByIdAndRemove(req.params.id);
            return res.status(200).json("user deleted");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getAllOrders: async (req,res) => {
        try {
            if( req.query.from !== "" && req.query.to !== "" ) {
                const orders = await Order.aggregate([{ $match: { date: { $gte: req.query.from, $lte: req.query.from } } }]);
                return res.status(200).json(orders);
            }
                const orders = await Order.aggregate([{ $match: {} }])
                return res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
            
        }
    },



}