const express = require('express'),
    env = require('dotenv').config(),
    path = require('path'),
    engine = require('ejs-locals');

////////// INITIALIZATIONS
/* ========================= */
/*           INIT            */           
/* ========================= */
const app = express()

/* ========================= */
/*            END            */           
/* ========================= */

////////// PATHS
/* ========================= */
/*           INIT            */           
/* ========================= */
const pathRoutes = path.join(__dirname, 'routes', 'index'),
    pathAssets = path.join(__dirname, 'assets'),
    pathViews = path.join(__dirname, 'views');
/* ========================= */
/*            END            */           
/* ========================= */

////////// MIDDLEWARES
/* ========================= */
/*           INIT            */           
/* ========================= */
app.use('/static', express.static(pathAssets))
app.use('/', require(pathRoutes))
app.engine('ejs', engine);
/* ========================= */
/*            END            */           
/* ========================= */

////////// SETTERS
/* ========================= */
/*           INIT            */           
/* ========================= */
app.set('views', pathViews)
app.set('view engine', 'ejs')
/* ========================= */
/*            END            */           
/* ========================= */
app.listen(process.env.PORT || process.env.DEVPORT, () => console.log('SERVER RUN'))