const Ingredient = require("../models/Ingredient")

module.exports = {

    createIngredient: async (req,res) => {
        try {
            const newIngr = new Ingredient({
                name: req.body.name,
                stock: req.body.stock,
                type: req.body.type,
                restaurant_id: req.params.restaurant_id,
                ingredients: req.body.ingredients,
            })

            await newIngr.save();
            return res.status(200).json("Ingredient created!")
        } catch (error) {
            return res.status(500).json(error)
        }
    },

    getIngredients: async (req,res) => {
        try {
            const ingredients = await Ingredient.find({ restaurant_id: req.params.restaurant_id });
            return res.status(200).json(ingredients)
        } catch (error) {
            return res.status(500).json(error)
            
        }
    },

    deleteIngredient: async (req,res) => {
        try {
            await Ingredient.findByIdAndRemove(req.params.id);
            return res.status(200).json("Deleted");
        } catch (error) {
            return res.status(500).json(error)
            
        }
    },

    
}
