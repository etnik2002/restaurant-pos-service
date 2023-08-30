const Category = require("../models/Category");
const Extras = require("../models/Extras");
const Floor = require("../models/Floor");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken")

module.exports = {

    createRestaurant: async (req,res) => {
        try {
            // const salt = bcrypt.genSaltSync(10);
            // const hashedPassword = bcrypt.hashSync(req.body.password, salt);
            console.log(req.body)
            const newRestaurant = new Restaurant({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            })

            await newRestaurant.save();
            return res.status(201).json("restaurant created !");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    }, 

    login: async (req,res) => {
        try {
            const restaurant = await Restaurant.findOne({ email: req.body.email });
            if (!restaurant) {
              return res.status(401).json({ message: "Invalid Email " });
            }
      
            const validPassword = req.body.password === restaurant.password;
      
            if (!validPassword) {
              return res.status(401).json({ data: null, message: "Invalid  Password" });
            }
      
            const token = restaurant.generateAuthToken(restaurant);
            res.status(200).json({ data: token, message: "logged in successfully" });
          
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getAllRestaurants: async (req,res) => {
        try {
            console.log("here")
            const restaurant = await Restaurant.aggregate([{ $match: {} }]);
            return res.status(200).json(restaurant);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`);          
        }
    },

    getRestaurantById: async (req,res) => {
        try {
            const restaurant = await Restaurant.findById(req.params.id).select('-password');
            return res.status(200).json(restaurant);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`);          
        }
    },

    getRestaurantProducts : async (req,res) => {
        try {
            const products = await Product.aggregate([{ $match: { restaurant_id: req.params.restaurant_id } }]);
            return res.status(200).json(products);      
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getRestaurantCategories : async (req,res) => {
        try {
            const cats = await Category.aggregate([{ $match: { restaurant_id: req.params.restaurant_id } }]);
            return res.status(200).json(cats);      
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getRestaurantFloor: async (req,res) => {
        try {
            const floors = await Floor.aggregate([{ $match: { restaurant_id: req.params.restaurant_id } }]);
            return res.status(200).json(floors);      
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    
    getRestaurantOrders : async (req,res) => {
        try {
            const orders = await Order.aggregate([{ $match: { restaurant_id: req.params.restaurant_id } }]);
            return res.status(200).json(orders);            
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getRestaurantExtras : async (req,res) => {
        try {
            const extras = await Extras.aggregate([{ $match: { restaurant_id: req.params.restaurant_id } }]);
            return res.status(200).json(extras);            
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

}