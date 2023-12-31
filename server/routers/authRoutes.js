const express = require('express')
const router = express.Router()
const AuthController = require('../controller/authController')

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
// router.get('/logout', AuthController.logoutUser)
// router.get('/loggedIn', AuthController.getLoggedIn)

module.exports = router