const router = require("express").Router();
const { createOrder, getOrderById, payOrder, prepareOrder } = require("../controllers/order-controller");


router.post('/create/:restaurant_id/:table_id', createOrder);

router.get('/:id', getOrderById);

router.post('/pay/:id', payOrder)

router.post('/prepare/:id', prepareOrder)

module.exports = router;