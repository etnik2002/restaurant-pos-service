const Order = require("../models/Order");
const Table = require("../models/Table");

module.exports = {

    createTable: async (req,res) => {
        try {
            const tables = await Table.find({
                restaurant_id: req.params.restaurant_id,
                floor: req.params.floor
              }).countDocuments().exec();
              
              console.log("Number of tables:", tables);
              
              const tableCode = `T${tables + 1}`;
              
              console.log("generated table code: ", tableCode);

            const newTable = new Table({
                code: tableCode,
                capacity: req.body.capacity,
                x: req.body.x,
                y: req.body.y,
                restaurant_id: req.params.restaurant_id,
                floor: req.params.floor,
            })

            await newTable.save();
            return res.status(201).json("table created");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    deleteTable: async (req,res) => {
        try {
            await Table.findByIdAndRemove(req.params.id);
            return res.status(200).json("Successfully deleted order");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    getTableById: async (req,res) => {
        try {
            const table = await Table.aggregate([{ $match: { _id: req.params.id, restaurant_id: req.params.restaurant_id } }]);
            return res.status(200).json(table[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    moveTable: async (req,res) => {
        try {
            const movedTable = await Table.findByIdAndUpdate(req.params.table_id, { $set: { x: req.body.x, y: req.body.y } });
            console.log({ newX: movedTable.x, newY: movedTable.y });
            return res.status(200).json("Table moved successfully -> new coords: " + movedTable.x, movedTable.y)
        } catch (error) {
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    takeTable: async (req,res) => {
        try {
            const take = await Table.findByIdAndUpdate(req.params.id, { $set: { isTaken: true }});
            // await module.exports.leaveTable(req,res)
            return res.status(200).json("Table taken ");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    leaveTable: async (req,res) => {
        try {
            const left = await Table.findByIdAndUpdate(req.params.id, { $set: { isTaken: false }});
            return res.status(200).json("Table left ");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    payTable: async (req,res) => {
        try {
            await Table.findByIdAndUpdate(req.params.id, { $set: { isPaid: true , isTaken:false }});
            await Order.findByIdAndUpdate(req.params.id, { $set: { isPaid: true }});
            return res.status(200).json("Order paid");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },



}