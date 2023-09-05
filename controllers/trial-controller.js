const Restaurant = require("../models/Restaurant");
const crypto = require("crypto");
const User = require("../models/User");
const Waiter = require("../models/Waiter");
const { checkRestaurantAccessType } = require("../controllers/restaurant-controller");
const { receiveFreeTrialRequest, sendCredentialsToFreeTrialAccount } = require("../helpers/mail/freeTrial");


module.exports = {

    createFreeTrialAccount: async (req,res) => {
        try {
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1; 
            const year = today.getFullYear();
            
            if (day < 10) {
              day = `0${day+3}`;
            }
            
            if (month < 10) {
              month = `0${month}`;
            }
            
            const formattedDate = `${day}-${month}-${year}`;
            
            const password = generatePassword(8);

            const newRestaurant = new Restaurant({
                name: req.body.name,
                email: req.body.email,
                password: password,
                access: "free_trial",
                trialDate: formattedDate,
                isActive: true,
                plan: "enterprise"
            });

            const managerTrial = await createTrialManager(newRestaurant._id, req.body);
            const waiterTrial = await createTrialWaiter(newRestaurant._id, req.body);

            await newRestaurant.save();
            await receiveFreeTrialRequest(newRestaurant);
            await sendCredentialsToFreeTrialAccount(req.body.email, req.body.name, newRestaurant, managerTrial, waiterTrial);

            return res.status(200).json("Free trial account created successfylly. Please download our app and login with the created account!");
        } catch (error) {
            console.log(error);
        }
    },

    toggleFreeTrialPlan: async (req,res) => {
        try {
            const trialAccount = await Restaurant.findById(req.params.id);
            const newPlan = trialAccount.plan == "enterprise" ? trialAccount.plan = "premium" : "enterprise";
            await Restaurant.findByIdAndUpdate(req.params.id, { $set: { plan: newPlan }});
            return res.status(200).json(`Switched to ${newPlan} plan.`);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

}


function generateRandomEmail(text) {
    const prefix = text.split(" ")[0];
    const randomString = crypto.randomBytes(1).toString('hex'); 
    const email = `${prefix}${randomString}.trial@insylink.com`;
    
    return email;
  }


function generatePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }
  
    return password;
  }

  function generateRandomPIN() {
    const min = 1000; 
    const max = 9999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function createTrialManager(restaurant_id, data) {
    try {
        const email = generateRandomEmail(data.name);

        const newManager = new User({
            name: data.name,
            email: email,
            password: data.password,
            role: 'manager',
            restaurant_id: restaurant_id
        })

        await newManager.save();
        return newManager;

    } catch (error) {
        console.log(error);
    }
  }

  async function createTrialWaiter(restaurant_id, data) {
    try {
        const waiterName = data.name.split(" ")[0];
        const pin = generateRandomPIN();

        const newWaiter = new Waiter({
            name: waiterName,
            pin: pin,
            restaurant_id: restaurant_id,
        })

        await newWaiter.save();
        return newWaiter;

    } catch (error) {
        console.log(error);
    }
  }