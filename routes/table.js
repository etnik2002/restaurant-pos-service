const router = require("express").Router();
const { createTable, getTableById, takeTable, leaveTable, payTable } = require("../controllers/table-controller");


router.post('/create/:restaurant_id/:floor', createTable);

router.get('/:id', getTableById);

router.post('/take/:id', takeTable);

router.post('/leave/:id', leaveTable);

router.post('/pay/:id', payTable);

module.exports = router;