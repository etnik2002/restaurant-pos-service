const router = require("express").Router();
const { createOrder, getOrderById } = require("../controllers/order-controller");


router.post('/create/:restaurant_id', createOrder);

router.get('/:id', getOrderById);

module.exports = router;