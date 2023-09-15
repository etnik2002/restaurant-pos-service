const Product = require("../models/Product");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

module.exports = {

    createProduct: async (req,res) => {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);

            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                stock: req.body.stock,
                image: result.secure_url,
                restaurant_id: req.params.restaurant_id
            })

            console.log({newProduct})
            await newProduct.save();
            return res.status(201).json("product created");
        } catch (error) {
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