const router = require("express").Router();
const { createUser, findUserById, getAllManagers, getAllSupervisors, getAllOrders, deleteUser } = require("../controllers/user-controller");


router.post('/create', createUser);

router.get('/:id', findUserById);

router.get('/managers', getAllManagers);

router.get('/supervisors', getAllSupervisors);

router.get('/orders', getAllOrders);

router.post('/delete/:id', deleteUser);

module.exports = router;