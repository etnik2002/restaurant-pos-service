const mongoose  = require("mongoose");
const Category = require("../models/Category");
const Floor = require("../models/Floor");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken");
const moment = require("moment");

function compare( a, b ) {
    if ( a.sales < b.sales ){
      return -1;
    }
    if ( a.sales > b.sales ){
      return 1;
    }
    return 0;
  }

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

    login: async (req, res) => {
        try {
          const restaurant = await Restaurant.findOne({ email: req.body.email });
      
          if (!restaurant) {
            return res.status(404).json("Restaurant not found");
          }
      
          const isFreeTrial = await checkRestaurantAccessType(restaurant);
      
          if (isFreeTrial) {
            const response = await checkFreeTrialExpiration(restaurant);
            if (response.access === false) {
              return res.status(401).json(response.message);
            }
          }
      
          const validPassword = req.body.password === restaurant.password;
      
          if (!validPassword) {
            return res.status(401).json({ data: null, message: "Invalid Password" });
          }
      
          const token = restaurant.generateAuthToken(restaurant);
          res.status(200).json({ data: token, message: "Logged in successfully" });
        } catch (error) {
          console.log(error);
          return res.status(500).json(`Error -> ${error}`);
        }
      },
      
      scannerLogin: async (req,res) => {
        try {
            const restaurant = await Restaurant.findById(req.params.id);
            console.log({restaurant})
            if (!restaurant) {
                return res.status(404).json("Restaurant not found");
              }
          
              const isFreeTrial = await checkRestaurantAccessType(restaurant);
          
              if (isFreeTrial) {
                const response = await checkFreeTrialExpiration(restaurant);
                if (response.access === false) {
                  return res.status(401).json(response.message);
                }
              }
          
              // const validPassword = req.body.password === restaurant.password;
            
              // if (!validPassword) {
              //   return res.status(401).json({ data: null, message: "Invalid Password" });
              // }
          
              const token = restaurant.generateAuthToken(restaurant);
              res.status(200).json({ data: token, message: "Logged in successfully" });

        } catch (error) {
            console.log(error);
            return res.status(500).json("errir -> " + error)
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
            const products = await Product.find({restaurant_id: req.params.restaurant_id}).populate('category');
            console.log(products)
            return res.status(200).json(products);      
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getRestaurantCategories : async (req,res) => {
        try {
            const cats = await Category.find( { restaurant_id: req.params.restaurant_id } );
            return res.status(200).json(cats);      
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getRestaurantFloor: async (req,res) => {
        try {
            const floors = await Floor.find({ restaurant_id: new mongoose.Types.ObjectId(req.params.restaurant_id) });
            return res.status(200).json(floors);      
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    mostOrderedDish: async (req,res) => {
        try {
            const products = await Product.find({ restaurant_id: req.params.restaurant_id });
            const countProducts = []
            products.map((p) => {
                if(p.sales) {
                    countProducts.push(p)
                }
            })
            const sorted = countProducts.sort((a,b) => a.sales > b.sales)
            return res.status(200).json(sorted)
        } catch (error) {
            console.log(error)
            return res.status(500).json(`error -> ${error}`); 
        }
    },
    
    getRestaurantOrders: async (req, res) => {
        try {
          const orders = await Order.find({ restaurant_id: req.params.restaurant_id })
            .populate('waiter products restaurant_id')
            .populate({
              path: 'table',
              populate: { path: 'floor' },
            });
      
          const products = await Product.find({ restaurant_id: req.params.restaurant_id });
      
          const countProducts = products.filter((p) => p.sales);
      
          countProducts.sort((a, b) => b.sales - a.sales);
      
          const mostOrderedDish = countProducts.length > 0 ? countProducts[0] : null;

          return res.status(200).json({ orders: orders, mostOrderedDish: mostOrderedDish });
        } catch (error) {
          console.log(error);
          return res.status(500).json(`error -> ${error}`);
        }
      },

      getTodaysOrders: async (req, res) => {
        try {
          const currentDate = moment().format('DD-MM-YYYY');

          const orders = await Order.find({
            restaurant_id: req.params.restaurant_id,
            date: { $gte: currentDate, $lte: currentDate } 
          })            
          .populate('waiter products restaurant_id')
          .populate({
            path: 'table',
            populate: { path: 'floor' },
          });
      
          console.log(orders);
          return res.status(200).json(orders);
        } catch (error) {
          console.log(error);
          return res.status(500).json(error);
        }
      },
      
      

    checkRestaurantAccessType: checkRestaurantAccessType,

    completeSetup: async (req,res) => {
        try {
            await Restaurant.findByIdAndUpdate(req.params.id, { $set: { isSetup: true } });
        } catch (error) {
            return res.status(500).json("errir -> " + error)
        }
    }

}

async function checkRestaurantAccessType(restaurant) {
    try {
        console.log(restaurant)
        console.log({r_access: restaurant.access})
        if(restaurant.access == "free_trial") {
            return true;
        }

        return false;
    } catch (error) {
        console.log(error);
    }
}

async function checkFreeTrialExpiration(user) {
    try {
        console.log(user)
        
        if(user.access != "free_trial") {
            return { message: "No free trial access!" };
        }

        const today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1; 
        const year = today.getFullYear();
        
        if (day < 10) {
          day = `0${day}`;
        }
        
        if (month < 10) {
          month = `0${month}`;
        }
        
        const formattedDate = `${day}-${month}-${year}`;

        if(user.trialDate < formattedDate) {
            return { message: "Free trial ended. Please contact our support team to start using InsyLink today.", access: false };
        }

        return { message: "Successfull login to free trial account. Please contact our support team to start using InsyLink today.", access: true };

    } catch(error) {

    }
}
