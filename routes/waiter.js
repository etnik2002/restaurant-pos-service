const router = require("express").Router();
const { createWaiter, login, getWaiterById, getWaiterOrders, deleteWaiter } = require("../controllers/waiter-controller");


router.post('/create/:restaurant_id', createWaiter);

router.post('/delete/:id', deleteWaiter);

router.post('/login/:restaurant_id', login);

router.get('/:restaurant_id/:id', getWaiterById);

router.get('/orders/:restaurant_id/:waiter_id', getWaiterOrders);

module.exports = router;