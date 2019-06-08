const express = require('express'),
    router = express.Router(),
    path = require('path');

const pathControllers = path.join(__dirname, '../', 'api', 'controllers', 'index'),
    controllers = require(pathControllers)


router.get('/', controllers.index)
router.get('*', controllers.pageNotFound)

module.exports = router