const express = require('express'),
    router = express.Router(),
    path = require('path');

const pathControllers = path.join(__dirname, '../', 'api', 'controllers', 'index'),
    pathMiddlewares = path.join(__dirname, '../', 'api', 'middlewares', 'index'),
    middlewares = require(pathMiddlewares),
    controllers = require(pathControllers)


router.get('/', controllers.index)
router.get('/agregar', middlewares.authorization, controllers.addMovie)
router.get('/perfil', middlewares.authorization, controllers.profile)
router.get('/favoritas', middlewares.authorization, controllers.favoriteMovies)
router.get('/*', controllers.pageNotFound)

module.exports = router