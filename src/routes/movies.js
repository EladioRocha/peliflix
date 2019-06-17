const express = require('express'),
    router = express.Router(),
    path = require('path');

const pathControllers = path.join(__dirname, '../', 'api', 'controllers', 'movies'),
    pathMiddlewares = path.join(__dirname, '../', 'api', 'middlewares', 'index'),
    middlewares = require(pathMiddlewares),
    controllers = require(pathControllers);

router.get('/:id', controllers.singleMovie)
router.get('/buscar/titulo', controllers.search)
router.get('/buscar/actor', controllers.search)
router.get('/buscar/productor', controllers.search)
router.get('/buscar/director', controllers.search)
router.get('/buscar/favorita', controllers.search)
router.get('/editar/:id', middlewares.authorization, controllers.dataMovie)

router.post('/agregar', middlewares.authorization, controllers.save)
router.post('/calificacion', controllers.addScore)
router.post('/agregar/favorita', controllers.addFavoriteMovie)
router.post('/agregar/comentario', middlewares.authorization, controllers.addCommentMovie)

router.put('/editar', middlewares.authorization, controllers.editMovie)

router.delete('/eliminar', middlewares.authorization, controllers.deleteMovie)
module.exports = router