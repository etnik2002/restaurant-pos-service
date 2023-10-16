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
            console.log(req.body.stock)
            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                stock: req.body.stock || 0,
                image: result.secure_url,
                restaurant_id: req.params.restaurant_id,
                ingredients: req.body.ingredients,
            })

            await newProduct.save();
            return res.status(201).json("product created");
        } catch (error) {
            console.log(error)
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

    
    editProduct: async(req,res) => {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            const product = await Product.findById(req.params.id)

            const editPayload = {
                name : req.body.name || product.name,
                price : req.body.price || product.price,
                tax : req.body.tax || product.tax,
                stock : req.body.price || product.stock,
                image : result.secure_url || product.image,
            }
            
            await Product.findByIdAndUpdate(product?._id, editPayload)
            return res.status(200).json('Category Updated Succesfully')
        } catch (error) {
            console.log(error)
            return res.status(500).json(`error -> ${error}`); 
        }
    },


    deleteProduct: async (req,res) => {
        try {
            await Product.findByIdAndRemove(req.params.id);
            return res.status(200).json("Product sucessfulyesafasmefoiesjnf")
        } catch (error) {
            console.log(error)
            return res.status(500).json(`error -> ${error}`)
        }
    },

}