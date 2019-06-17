const express = require('express'),
    router = express.Router(),
    path = require('path');

const pathControllers = path.join(__dirname, '../', 'api', 'controllers', 'users'),
    pathMiddlewares = path.join(__dirname, '../', 'api', 'middlewares', 'index'),
    middlewares = require(pathMiddlewares),
    controllers = require(pathControllers);

router.get('/salir', middlewares.authorization, controllers.logout)

router.post('/registro', middlewares.isLogged, function(req, res, next) {
    passport.authenticate('local-signup', function(err, user) {
        if (!user) {
            return res.json({'alert': req.passportMessage})
        } else {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.json({'alert': 'Datos correctos'})
            }); 
        }

        })(req, res, next);
    });
router.post('/entrar', middlewares.isLogged, function(req, res, next) {
    passport.authenticate('local-signin', function(err, user) {
      
        if (!user) {
            return res.json({'alert': 'Los campos ingresados son invalidos'})
        } else {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.json({'alert': 'Datos correctos'})
            }); 
        }

        })(req, res, next);
    });
router.post('/contrasenia', middlewares.authorization, controllers.changePassword)

router.put('/editar', middlewares.authorization, controllers.editProfile)
router.put('/editar/favoritas', middlewares.authorization, controllers.editPrivacityMovie)


module.exports = router