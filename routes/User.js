const express = require('express');
const router = express.Router();
// const { validateSignUp, validateLogin, validateUpdateDetails } = require("../middlewares/validationRequest.middlewares");
const {signUp, login, getDriverDetails, updateDetails, getDashboardDetails, getDrivers, getRiders} =  require('../controllers/User')

console.log("Hereee");
router.get("/users", (req, res) => {
    res.status(200).json({message:"users"})
})
router.post('/register', signUp);
router.post('/signin', login);
router.get('/getDriver', getDriverDetails);
router.get("/dashboard", getDashboardDetails)
router.get("/getDrivers", getDrivers);
router.get("/getRiders", getRiders)
router.put('/update', updateDetails);

module.exports = router;