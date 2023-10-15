const moment = require("moment");
const Order = require("../models/Order");
const Table = require("../models/Table");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const uuid = require('uuid');
const axios = require("axios");
const https = require('https');

module.exports = {

    createOrder: async (req,res) => {
        try {
            const cart = req.body.cart;
            let products = [];
            let price = 0;
            let orderedProducts = [];
            let uniqueID = "";
            
            cart.map((item) => {
                uniqueID = uuid.v1();
                console.log({uniqueID})
                orderedProducts.push({...item , note:item.note, uuid: uniqueID})
                products.push(item._id);
                price += item.price;
                uniqueID = "";
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

            for (const product of cart) {
                const productId = product._id;

                if (!productCounts[productId]) {
                    productCounts[productId] = 1;
                } else {
                    productCounts[productId]++;
                }
            }

            await Table.findByIdAndUpdate(req.params.table_id, { $set: { isTaken: true, current_order: createdOrder._id } });
            for (const orderedProduct of orderedProducts) {
                if (orderedProduct.ingredients.length > 0) {
                    for (const ingredientData of orderedProduct.ingredients) {
                        const ingredientId = ingredientData.ingredient;
                        const ingredientValue = ingredientData.value;

                        const ingredient = await Ingredient.findById(ingredientId);

                        if (ingredient) {
                            ingredient.stock -= ingredientValue / 100;
                            await ingredient.save();
                        }
                    }
                } else {
                    const productIdWithoutIngredients = orderedProduct._id;
                    const productCount = productCounts[productIdWithoutIngredients] || 0;

                    const productWithoutIngredients = await Product.findById(productIdWithoutIngredients);

                    if (productWithoutIngredients) {
                        productWithoutIngredients.stock -= (productCount % productCount) + 1;
                        await productWithoutIngredients.save();
                    }
                }
            }

            return res.status(201).json("Order placed");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    takeawayOrder: async (req,res) => {
        try {
            const cart = req.body.cart;
            let products = [];
            let price = 0;
            let orderedProducts = [];
            let uniqueID = "";
            
            cart.map((item) => {
                uniqueID = uuid.v1();
                console.log({uniqueID})
                orderedProducts.push({...item , note:item.note, uuid: uniqueID})
                products.push(item._id);
                price += item.price;
                uniqueID = "";
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

            for (const product of cart) {
                const productId = product._id;

                if (!productCounts[productId]) {
                    productCounts[productId] = 1;
                } else {
                    productCounts[productId]++;
                }
            }

            await Table.findByIdAndUpdate(req.params.table_id, { $set: { isTaken: true, current_order: createdOrder._id } });
            for (const orderedProduct of orderedProducts) {
                if (orderedProduct.ingredients.length > 0) {
                    for (const ingredientData of orderedProduct.ingredients) {
                        const ingredientId = ingredientData.ingredient;
                        const ingredientValue = ingredientData.value;

                        const ingredient = await Ingredient.findById(ingredientId);

                        if (ingredient) {
                            ingredient.stock -= ingredientValue /100;
                            await ingredient.save();
                        }
                    }
                } else {
                    const productIdWithoutIngredients = orderedProduct._id;
                    const productCount = productCounts[productIdWithoutIngredients] || 0;

                    const productWithoutIngredients = await Product.findById(productIdWithoutIngredients);

                    if (productWithoutIngredients) {
                        productWithoutIngredients.stock -= (productCount % productCount) + 1;
                        await productWithoutIngredients.save();
                    }
                }
            }


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
      
          let addedProducts = [];
          let product = {};
          let uniqueID = "";
          
          products.map((p) => {
            uniqueID = uuid.v1();
            p.isAddedAfter = true; 
            p.uuid = uniqueID;
            product = p;
            addedProducts.push(product);
            product = {};
            uniqueID = "";
          })
        
          const updatedProducts = [...order.orderedProducts, ...products];
      
          const editPayload = {
            orderedProducts: updatedProducts,
            isReady: false,
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

    printReceipt: async (req, res) => {
    let errorOccurred = false;

    try {
        const order = await Order.findById(req.params.id);

        const productsToPrint = {
            orderDate: new Date().toISOString(),
            items: order.orderedProducts.map((product) => ({
                name: product.name,
                price: product.price,
                quantity: 1,
            })),
        };

        await axios.post(
            `${process.env.LOCAL_IP_NET}/WeatherForecast/print/${req.params.id}`,
            productsToPrint,
            { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
        );

    } catch (error) {
        console.log({ resdata: error });
        errorOccurred = true;
    }

    if (errorOccurred) {
        return res.status(500).json("Error printing receipt");
    } else {
        return res.status(200).json("Printed");
    }
},


    testPrint: async (req,res) => {
        try {
            const test = { a: "test", b: "Test" };
            await axios.post(
                `http://192.168.100.254:5069/WeatherForecast/print/test`,
                { test },
                { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
            );

            return res.status(200).json("Printed")
        } catch (error) {
            console.error(error);
            return res.status(500).json(`Error -> ${error.message}`);
        }
    }
    

}