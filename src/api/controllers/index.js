const path = require('path'),
    pathDatabase = path.join(__dirname, '../', 'database', 'index'),
    { query } = require(pathDatabase);


module.exports = {
    index: async (req, res) => {
        const session = (req.session.passport) ? req.session.passport.user : ''
        movies = await query(`SELECT "idPelicula", "nombrePelicula", "fotoPoster", "Estrellas" FROM "Pelicula"`)
        total = await query(`SELECT COUNT(*) FROM "Pelicula"`)
        res.render('index', {title: 'Inicio', session, movies: movies.rows, total: total.rows[0].count})
    },

    addMovie: async (req, res) => {
        const session = (req.session.passport) ? req.session.passport.user : '',
            categories = await query(`SELECT * FROM "Categoria"`),
            directors = await query(`SELECT * FROM "Director"`),
            actors = await query(`SELECT * FROM "Actor"`),
            productors = await query(`SELECT * FROM "Productor"`);

        res.render('add_movie', {title: 'Agregar película', session, categories: categories.rows, directors: directors.rows, actors: actors.rows, productors: productors.rows})
    },

    profile: (req, res) => {
        const session = (req.session.passport) ? req.session.passport.user : ''
        res.render('profile', {title: 'Perfil de usuario', session})
    },

    favoriteMovies: async (req, res) => {
        const session = (req.session.passport) ? req.session.passport.user : ''
        const {rows}  = await query(
            `SELECT 
            "Pelicula"."nombrePelicula", 
            "Pelicula"."Resumen", 
            "Pelicula"."fotoPoster", 
            "Pelicula"."Estrellas", 
            "Pelicula"."idCategoria", 
            "Pelicula"."idPelicula", 
            peliculas_favoritas."idPelicula", 
            peliculas_favoritas."idUsuario", 
            peliculas_favoritas."Privacidad"
          FROM 
            public."Pelicula", 
            public.peliculas_favoritas
          WHERE 
            "Pelicula"."idPelicula" = peliculas_favoritas."idPelicula" AND peliculas_favoritas."idUsuario" = $1;`, [req.session.passport.user.idUsuario]) 
        res.render('favorite_movies', {title: 'Películas favoritas', session, rows})
    },

    pageNotFound: (req, res) => {
        const session = (req.session.passport) ? req.session.passport.user : ''
        res.render('404', {title: 'Página no encontrada', session})
    }
}