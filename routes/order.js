const router = require("express").Router();
const { createOrder, getOrderById, payOrder, readyOrder, editOrder, takeawayOrder, printReceipt, testPrint } = require("../controllers/order-controller");

router.post('/print/test', testPrint)

router.post('/create/takeaway/:restaurant_id', takeawayOrder);

router.post('/create/:restaurant_id/:table_id', createOrder);

router.get('/:id', getOrderById);

router.post('/:id', editOrder)

router.post('/pay/:id/:tableID', payOrder)

router.post('/ready/:id', readyOrder)

router.post('/print/:id', printReceipt)


module.exports = router;