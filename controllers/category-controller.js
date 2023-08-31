const Category = require("../models/Category");
const Product = require("../models/Product");

module.exports = {

    createCategory: async (req,res) => {
        try {
            const newCat = new Category({
                name: req.body.name,
                color: req.body.color,
                restaurant_id: req.params.restaurant_id,
                image: req.body.image,
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

}