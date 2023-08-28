const Floor = require("../models/Floor");
const Table = require("../models/Table");

module.exports = {

    createFloor: async (req,res) => {
        try {
            const newFloor = new Floor({
                name: req.body.name,
                restaurant_id: req.params.restaurant_id,
            })

            await newFloor.save();
            return res.status(201).json("Floor created");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`);    
        }
    },

    getFloorTables: async (req,res) => {
        try {
            const tables = await Table.aggregate([{ $match: { restaurant_id: req.params.restaurant_id, floor: req.params.floor_id } }])
            return res.status(200).json(tables);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    },

    deleteFloor: async (req,res) => {
        try {
            await Floor.findByIdAndRemove(req.params.id);
            return res.status(200).json("Floor successfully deleted");
        } catch (error) {
            console.log(error);
            return res.status(500).json(`error -> ${error}`); 
        }
    }

}