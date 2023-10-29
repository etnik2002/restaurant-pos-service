const mongoose  = require("mongoose");
const Category = require("../models/Category");
const Floor = require("../models/Floor");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Waiter = require("../models/Waiter");
// const OpenAIApi = require('openai');
const ObjectId = mongoose.Types.ObjectId;
const IP = require("ip");
// const OpenAIApi = require("openai")


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
          console.log("login dispatched")
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
          console.log(restaurant)
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

      registerPrinter: async (req,res) => {
        try {
          const { name, location, interface, connection } = req.body;
          const newPrinter = {
            name, location, interface, connection
          };
          console.log({newPrinter})

          await Restaurant.findByIdAndUpdate(req.params.restaurant_id, { $push: { printers: newPrinter } });

          return res.status(200).json("Printer registered successfully");
        } catch (error) {
          console.log(error);
          return res.status(500).json(`Error -> ${error}`);
        }
      },



      deletePrinter: async (req, res) => {
        try {
            const restaurant = await Restaurant.findById(req.params.restaurant_id);
    
            if (!restaurant) {
                return res.status(404).json("Restaurant not found");
            }
    
            const printerId = new ObjectId(req.params.printer_id);
    
            restaurant.printers = restaurant.printers.filter((printer) => {
                return !printer._id.equals(printerId);
            });
    
            await restaurant.save();
    
            return res.status(200).json("Successfully deleted printer");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`Error -> ${error}`);
        }
    },
      
    searchLocalIp: async (req,res) => {
      try {
          const ip = IP.address();
          console.log(ip)
          const restaurant = await Restaurant.findById(req.params.id);
          restaurant.ip = ip;
          await restaurant.save();
          return res.status(200).json(ip);
      } catch (error) {
          console.error(error);
          return res.status(500).json(`Error -> ${error.message}`);
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

      openShift: async (req, res) => {
        try {
          const { restaurant_id } = req.params;
          const {
            startingCash,
            openedFrom,
            openedAt
          } = req.body;
      
          await Restaurant.findByIdAndUpdate(
            restaurant_id,
            {
              $set: {
                isShiftOpen: true,
                startingCash: startingCash,
                shiftOpenedFrom: openedFrom,
                shiftOpenedAt: openedAt
              }
            }
          );
      
          return res.status(200).json({ message: 'Shift opened successfully.' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error.' });
        }
      },

      closeShift: async (req, res) => {
        try {
          const { restaurant_id } = req.params;
      
          await Restaurant.findByIdAndUpdate(
            restaurant_id,
            {
              $set: {
                isShiftOpen: false,
                startingCash: 0,
              }
            }
          );
      
          return res.status(200).json({ message: 'Shift closed successfully.' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error.' });
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
    
    getAllWaiters: async (req, res) => {
      try {
          const waiters = await Waiter.find({restaurant_id: req.params.restaurant_id } );
          return res.status(200).json(waiters);
      } catch (error) {
          console.log(error);
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
      
      updateReceipt: async (req,res) => {
        try {
          const { useRestaurantLogo, header, footer } = req.body;
          console.log(req.body)
          const restaurant = await Restaurant.findById(req.params.id);
          const updatedRestaurant = {
            name: restaurant.name,
            email: restaurant.email,
            napasswordme: restaurant.password,
            access: restaurant.access,
            trialDate: restaurant.trialDate,
            printers: restaurant.printers,
            isActive: restaurant.isActive,
            plan: restaurant.plan,
            isSetup: restaurant.isSetup,
            currency: restaurant.currency,
            receipt: {
              useLogo: useRestaurantLogo,
              header: header ? header : restaurant.receipt.header,
              footer: footer ? footer : restaurant.receipt.footer
            },
          }
          
          await Restaurant.findByIdAndUpdate(req.params.id, updatedRestaurant);
          return res.status(200).json("Updated");
        } catch (error) {
          console.log(error)
          return res.status(200).json("error -> " + error);
        }

      },
      

    checkRestaurantAccessType: checkRestaurantAccessType,

    completeSetup: async (req,res) => {
        try {
            await Restaurant.findByIdAndUpdate(req.params.id, { $set: { isSetup: true } });
        } catch (error) {
            return res.status(500).json("errir -> " + error)
        }
    },

    help: async (req,res) => {
      try {
              // const question = req.body.question;
          
              // const introductionToOurApp = "Hey chat, this is our restaurant POS system. It has everything a POS system needs, including kitchen display settings, menu, ordering system, receipt printing, and an admin dashboard accessible on the web. Our app is called Insylink, available on iOS and Android devices.";
          
              // const responses = {
              //   connectToPrinter: "You can connect to the printers via Bluetooth, WiFi, or USB. Connecting via USB is the best option because it's more stable and always responsive. Here's how to connect to the Epson TM-M30 receipt printer: To connect via bluetooth or wifi, turn on your printer, hold the button that is located near the cashier cable slot, a receipt wil be printer with the ip address. Write the ip address in the field in the settings tab and hit save. Connecting via bluetooth or wifi is the same procedure, connecting via usb you need to provide the usb slot port in the input field and hit save.",
              //   placeOrder: "To place an order, you have two options: takeaway and dine-in. For dine-in orders, go to the floors tab, select the floor, choose an available table, go to the menu tab, select products, and hit place order. For takeaway orders, go to the takeaway tab and follow the same procedure.",
              //   printReceipt: "To print a receipt, go to the floors tab, select the table for which you want to print the receipt, and hit print. It will automatically print a receipt.",
              //   addExtraProductsAfterTheOrderIsPlaced: "If the customer wants to add something to the order after placing it, go to the orders tab, hit edit on the order, add the additional products, and hit save.",
              //   howToCreateFloor: "To create a floor, go to the floors tab, click on add floor, enter the floor's name in the popup, and hit create.",
              //   howToCreateTables: "To create a table, go to the floors tab, select the floor, click on add table, enter the number of chairs for the table in the popup, and hit create.",
              //   deleteFloor: "To delete a floor, go to the floors tab, hold the floor you want to delete, and confirm deletion in the popup.",
              //   deleteTable: "To delete a table, go to the floors tab, select the floor, hold the table you want to delete, and confirm deletion in the popup.",
              // };
          
              // const whatYouNeedToDo = `${introductionToOurApp}. Now, chat, if you don't know anything, don't apologize—just go straight to the answer. Your task is to take the user's question: ${question}, and use the responses provided in this object : ${JSON.stringify(responses)}. Respond to the user based on their question. If the user asks something outside the provided responses, apologize and state that you can't provide an answer on that topic. Please avoid modifying the responses, only fix grammar and typos if necessary.And please make sure to response in the language the question is made. Thank you.`;
          
              // const apiKey = process.env.OPENAI_API_KEY;
              // const openai = new OpenAIApi.OpenAI({ key: apiKey });
          
              // const messages = [
              //   { role: "user", content: whatYouNeedToDo },
              //   { role: "assistant", content: question },
              // ];
          
              // const completion = await openai.chat.completions.create({
              //   model: 'gpt-3.5-turbo',
              //   messages: messages,
              // });
          
              // const responseText = completion.choices[0].message.content;
              // console.log(responseText);
          
              res.status(200).json("Under construction");
            } catch (error) {
              console.error("Error:", error);
              res.status(500).json({ error: "Something went wrong -> " + error });
            }
        },

        finishSetup: async (req,res) => {
          try {
            await Restaurant.findByIdAndUpdate(req.params.id, req.body);
            return res.status(200).json("Saved restaurant")
          } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Something went wrong -> " + error });
          }
        },

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
