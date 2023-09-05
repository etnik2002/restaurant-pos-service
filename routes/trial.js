const router = require("express").Router();
const { createFreeTrialAccount, toggleFreeTrialPlan } = require('../controllers/trial-controller');

router.post('/create', createFreeTrialAccount);

router.post('/toggle-plan/:id', toggleFreeTrialPlan)

module.exports = router;