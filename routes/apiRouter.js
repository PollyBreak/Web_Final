const Router = require('express')
const router = new Router()
const controller = require('../apiController')
const {check} = require("express-validator")
const roleMiddleware = require('../middleware/roleMiddleware')

router.get('/holidays', roleMiddleware(["ADMIN","USER"]), controller.countHolidaysByMonths)

router.get('/marketcap', roleMiddleware(["ADMIN","USER"]), controller.getHistoricalMarketCapApple)

router.get('/asiapopulation', roleMiddleware(["ADMIN","USER"]), controller.getAsiaPopulation)

module.exports = router