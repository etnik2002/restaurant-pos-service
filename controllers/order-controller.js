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
            let orderedProducts = [];
            

            cart.map((item) => {
                orderedProducts.push({...item , note:item.note})
                products.push(item._id);
                price += item.price;
            })

            const newOrder = new Order({
                products: products,
                waiter: req.body.waiter,
                table: req.body.type == "dineIn" ? req.body.table : null,
                orderedProducts: orderedProducts,
                restaurant_id: req.params.restaurant_id,
                price: price,
                type: req.body.type,
                date: moment().format('DD-MM-YYYY'),
            })

            const createdOrder = await newOrder.save();

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
                await Product.findByIdAndUpdate(productId, { $inc: { sales: productCounts[productId] } });
            }

            await Table.findByIdAndUpdate(req.params.table_id, { $set: { isTaken: true, current_order: createdOrder._id } });
         
            return res.status(201).json("Order placed");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    editOrder: async (req, res) => {
        try {
          const products = req.body.products;
          const order = await Order.findById(req.params.id);
      
          const updatedProducts = [...order.orderedProducts, ...products];
      
          const editPayload = {
            orderedProducts: updatedProducts,
          };
      
          await Order.findByIdAndUpdate(order._id, editPayload);
      
          return res.status(200).json("Order successfully updated");
        } catch (error) {
          console.log(error);
          return res.status(500).json(`Error -> ${error}`);
        }
      },
      


    getOrderById: async (req,res) => {
        try {
            // const order = await Order.aggregate([{ $match: { _id: req.params.id, restaurant_id: req.params.restaurant_id } }]);
            const order = await Order.findById(req.params.id).populate('products waiter confirmed_by restaurant_id table')
            return res.status(200).json(order);            
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    payOrder: async (req,res) => {
        try {
            await Order.findByIdAndUpdate(req.params.id, { $set: { isPaid: true } });
            await Table.findByIdAndUpdate(req.params.tableID, { $set: { isTaken:false, isPaid:true }})
            return res.status(200).json("Order is paid");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    readyOrder: async (req,res) => {
        try {
            await Order.findByIdAndUpdate(req.params.id, { $set: { isReady: true } });
            return res.status(200).json("Order paid successfully");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

}