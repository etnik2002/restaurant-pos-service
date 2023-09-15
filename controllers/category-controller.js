const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

module.exports = {
    createCategory: async (req,res) => {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            const newCat = new Category({
                name: req.body.name,
                tax: req.body.tax,
                restaurant_id: req.params.restaurant_id,
                image: result.secure_url,
            })

            await newCat.save(); 
            return res.status(201).json("Category created"); 
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getCategoryById: async (req,res) => {
        try {
            const cat = await Category.aggregate([{ $match: { _id: req.params.id } }])
            return res.status(200).json(cat[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getCategoryProducts: async (req,res) => {
        try {
            console.log(req.params)
            // const catProducts = await Product.aggregate([
            //     {
            //       $match: {
            //         category: req.params.id,
            //         restaurant_id: req.params.restaurant_id
            //       }
            //     },
                
            //   ]).exec();
              
            const catProducts = await Product.find({
                category: req.params.id,
                restaurant_id: req.params.restaurant_id
            })
            console.log(catProducts)
            return res.status(200).json(catProducts);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    editCategoryByID: async(req,res) => {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            const category = await Category.findById(req.params.id)

            const editPayload = {
                name : req.body.name || category.name,
                tax : req.body.tax || category.tax,
                image : result.secure_url || category.image,
            }

            await Category.findByIdAndUpdate(category?._id, editPayload)
            return res.status(200).json('Category Updated Succesfully')
        } catch (error) {
            console.log(error)
            return res.status(500).json(`error -> ${error}`); 
        }
    },


    deleteCategory: async (req,res) => {
        try {
            await Category.findByIdAndRemove(req.params.id);
            return res.status(200).json("deleted sucessfulyesafasmefoiesjnf")
        } catch (error) {
            console.log(error)
            return res.status(500).json(`error -> ${error}`)
        }
    },

}