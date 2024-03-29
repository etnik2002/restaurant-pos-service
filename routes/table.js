const router = require("express").Router();
const { createTable, getTableById, takeTable, leaveTable, payTable, moveTable, deleteTable } = require("../controllers/table-controller");


router.post('/create/:restaurant_id/:floor', createTable);

router.post('/delete/:id', deleteTable);

router.get('/:id', getTableById);

router.post('/take/:id', takeTable);

router.post('/leave/:id', leaveTable);

router.post('/pay/:id', payTable);

router.post('/move/:table_id', moveTable)

module.exports = router;