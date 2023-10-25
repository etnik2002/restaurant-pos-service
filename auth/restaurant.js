const Restaurant = require('../models/Restaurant');
const jwt = require("jsonwebtoken");

module.exports = {

    verifyPremiumAccount: async (req, res, next) => {
        try {
            const headers = req.headers.authorization || req.headers['Authorization'];
            const access_token = headers.split(' ')[1]
        } catch (error) {
            console.error(error);
            return res.status(500).json(`Error -> ${error}`);
        }
    },

}