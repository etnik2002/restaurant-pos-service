const moment = require("moment");
const Order = require("../models/Order");
const Table = require("../models/Table");
const Product = require("../models/Product");

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

            const productCounts = {};
            
            cart.forEach((product) => {
              const productId = product._id;
              
              if (!productCounts[productId]) {
                productCounts[productId] = 1;
              } else {
                productCounts[productId]++;
              }
            });
            
            for (const productId in productCounts) {
              console.log(`Product ID: ${productId}, Count: ${productCounts[productId]}`);
                await Product.findByIdAndUpdate(productId, { $inc: { sales: productCounts[productId] } });
            }

            await Table.findByIdAndUpdate(req.params.table_id, { $set: { isTaken: true } });
         
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