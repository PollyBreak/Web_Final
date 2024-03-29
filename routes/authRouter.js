const Router = require('express')
const router = new Router()
const controller = require('../authController')
const {check} = require("express-validator")
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/register', [
    check('username', "Username must not be empty").notEmpty(),
], controller.registration)

router.post('/login', controller.login)

router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)

module.exports = router