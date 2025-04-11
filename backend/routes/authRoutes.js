const express = require('express');
const {registerUser, loginUser, changePassword} = require('../controllers/authController');

const router = express.Router();




// All routes related to the authentication and authorization
router.post('/register', registerUser);
router.post('/login', loginUser);


module.exports = router;