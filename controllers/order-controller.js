const moment = require("moment");
const Order = require("../models/Order");
const Table = require("../models/Table");
const Product = require("../models/Product");
const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');
const escpos = require('escpos');
const usb = require('usb');
const printer = new escpos.Printer(usb);


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
                table: req.body.table,
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
            
            const vendorId = 1208; 
            const productId = 3616; 
            
            const device = usb.findByIds(vendorId, productId);
            
            if (device) {
              device.open((error) => {
                if (error) {
                  console.error('Error opening printer:', error);
                  alert('Error opening printer. Please try again.');
                  return;
                }
            
                function sendCommand(command) {
                  const buffer = Buffer.from(command, 'binary');
                  device.controlTransfer(0x40, 0x02, 0x0002, 0, buffer, (error) => {
                    if (error) {
                      console.error('Error sending command:', error);
                    }
                  });
                }
            
                const receiptText = `
                  --------------------------------
                  RECEIPT HEADER
                  --------------------------------
                  Item           Quantity  Price
                  --------------------------------
                  Item 1         2         $10.00
                  Item 2         1         $5.00
                  --------------------------------
                  Total:                   $15.00
                  --------------------------------
                  Thank you for your purchase!
                `;
            
                sendCommand('\x1B\x40'); 
                sendCommand('\x1B\x61\x01'); 
                sendCommand(receiptText);
                sendCommand('\x0A'); 
                sendCommand('\x1D\x56\x41\x10');
            
                device.close((error) => {
                  if (error) {
                    console.error('Error closing printer:', error);
                  }
                });
              });
            } else {
              console.error('Printer not found.');
            }
         
            return res.status(201).json("Order placed");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
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