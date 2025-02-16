const express = require('express');
const { createDriver, getDrivers } = require('../controllers/driver.controller');

const router = express.Router()

router.post('/create', createDriver);
router.get("/get", getDrivers)


module.exports = router;