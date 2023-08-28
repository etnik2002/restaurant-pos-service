const Extras = require("../models/Extras");

module.exports = {

    createExtras: async (req,res) => {
        try {
            const newExtra = new Extras({
                name: req.body.name,
                price: req.body.price,
                restaurant_id: req.params.restaurant_id,
            })

            await newExtra.save();
            return res.status(201).json("Extras created");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getRestaurantExtras: async (req,res) => {
        try {
            const extras = await Extras.aggregate([{ $match: { _id: req.params.restaurant_id } }]);
            return res.status(200).json(extras);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    deleteExtra: async (req,res) => {
        try {
            await Extras.findByIdAndRemove(req.params.id);
            return res.status(200).json("Extras deleted");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`);  
        }
    },

    

}