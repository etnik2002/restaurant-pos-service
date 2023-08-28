const router = require("express").Router();
const { createOrder, getOrderById } = require("../controllers/order-controller");


router.post('/create', createOrder);

router.get('/:id', getOrderById);

module.exports = router;