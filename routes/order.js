const router = require("express").Router();
const { createOrder, getOrderById, payOrder, readyOrder } = require("../controllers/order-controller");


router.post('/create/:restaurant_id/:table_id', createOrder);

router.get('/:id', getOrderById);

router.post('/pay/:id/:tableID', payOrder)

router.post('/ready/:id', readyOrder)

module.exports = router;