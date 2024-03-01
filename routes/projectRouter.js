const Router = require('express')
const router = new Router()
const controller = require('../projectController')
const {check} = require("express-validator")
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')


router.post('',roleMiddleware(["ADMIN"]), controller.createProject)

router.get('', controller.getProjects)

router.get('/:id', controller.getProjectById)

router.put('/:id',roleMiddleware(["ADMIN"]), controller.updateProjectById)

router.delete('/:id',roleMiddleware(["ADMIN"]), controller.deleteProjectById)


module.exports = router