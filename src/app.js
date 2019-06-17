/**Importamos los módulos que vamos a necesitar en este archivo, aquí solo se encuentran los
    módulos necesarios para hacer funcionar el servidor
    
    ****** AUTORES ******
    -
    -
**/ 

const express = require('express'), //Este módulos es el que hace funcionar el servidor.
    env = require('dotenv').config(), //Este módulos nos permite crear variables de entorno para mayor organización y seguridad.
    path = require('path'), // Este nos permite unir cualquier URL ya sea Linux, Mac o Windows.
    bodyParser = require('body-parser'), // Middleware que nos ayuda a recibir los JSON desde el servidor.
    engine = require('ejs-locals'), // Es un motor de plantillas que simplifica el trabajo y nos permite evitar copiar y pegar código.
    passport = require('passport'),
    fileUpload = require('express-fileupload')
    session = require('express-session');


////////// PATHS
/* ========================= */
/*           INIT            */           
/* ========================= */

// Aquí simplemente obtenemos la URL de cada una de las rutas necesarias.
const pathRoutesIndex = path.join(__dirname, 'routes', 'index'),
    pathRoutesUsers = path.join(__dirname, 'routes', 'users'),
    pathRoutesMovies = path.join(__dirname, 'routes', 'movies'),
    pathAssets = path.join(__dirname, 'assets'),
    pathViews = path.join(__dirname, 'views'),
    pathPassportLocal = path.join(__dirname, 'helpers', 'passport');
/* ========================= */
/*            END            */           
/* ========================= */

////////// INITIALIZATIONS
/* ========================= */
/*           INIT            */           
/* ========================= */

// Esto nos permite que los valores puedan ser además de JSON, string o arreglos, si lo cambiamos a true, permite cualquier tipo.
const app = express(),
    urlencodedParser = bodyParser.urlencoded({limit: '50mb',extended: true });
    passportLocal = require(pathPassportLocal)
/* ========================= */
/*            END            */           
/* ========================= */

////////// MIDDLEWARES
/* ========================= */
/*           INIT            */           
/* ========================= */

//Estos son los middlewares importantes ya que se procesan y cargan todo lo necesario como los archivos estaticos (css, js, img)
app.use(bodyParser.json({limit: '50mb'}));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
}));
app.use(urlencodedParser);
app.use(session({
    secret: 'My-secret-session',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({
    type: ['application/json', 'text/plain']
  }))
app.use('/static', express.static(pathAssets))
app.use('/usuarios', require(pathRoutesUsers))
app.use('/peliculas', require(pathRoutesMovies))
app.use('/', require(pathRoutesIndex))
app.engine('ejs', engine);
/* ========================= */
/*            END            */           
/* ========================= */

////////// SETTERS
/* ========================= */
/*           INIT            */           
/* ========================= */

// Configuramos el motor de plantillas que usaremos y la carpeta de nuestras vistas
app.set('views', pathViews)
app.set('view engine', 'ejs')
/* ========================= */
/*            END            */           
/* ========================= */




// El servidor es activado y comienza a funcionar.
app.listen(process.env.PORT || process.env.DEVPORT, () => console.log('SERVER RUN:',process.env.PORT || process.env.DEVPORT))