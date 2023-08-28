const Product = require("../models/Product");

module.exports = {

    createProduct: async (req,res) => {
        try {
            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                category: req.params.category,
                restaurant_id: req.params.restaurant_id
            })

            await newProduct.save();
            return res.status(201).json("product created");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getProductById: async (req,res) => {
        try {
            const product = await Product.aggregate([{ $match: { _id: req.params.id, restaurant_id: req.params.restaurant_id } }]);
            return res.status(200).json(product[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    

}