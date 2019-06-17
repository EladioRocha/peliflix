const path = require('path'),
    database = path.join(__dirname, '../', 'database', 'index'),
    { query } = require(database);
module.exports = {
    save: async (req, res) => {
        const nameImage = `${req.files.poster.md5}.png`,
            pathPosters = path.join(__dirname, '../', '../','assets', 'img', 'posters', nameImage),
            poster = req.files.poster;
        
        let params = [req.body.title, req.body.summary, nameImage, 0, req.body.category]

        const { rows } = await query(
            `INSERT INTO "Pelicula"(
            "nombrePelicula", "Resumen", "fotoPoster", "Estrellas", "idCategoria", 
            "idPelicula")
            VALUES ($1, $2, $3, $4, $5, DEFAULT)
            returning "idPelicula";`, params)

        params = [rows[0].idPelicula, req.session.passport.user.idUsuario]
        await query(
            `INSERT INTO "Usuario_has_Pelicula"(
            "idPelicula", "idUsuario")
            VALUES ($1, $2);`, params)

        params = [req.body.actor, rows[0].idPelicula]
        await query(
            `INSERT INTO pelicula_has_actor(
            "idActor", "idPelicula")
            VALUES ($1, $2);`, params)
        
        params = [rows[0].idPelicula, req.body.productor]
        await query(
            `INSERT INTO pelicula_has_productor(
            "idPelicula", "idProductor")
            VALUES ($1, $2);`, params)

        params = [req.body.director, rows[0].idPelicula]
        await query(
            `INSERT INTO peliculas_has_director(
            "idDirector", "idPelicula")
            VALUES ($1, $2);`, params)

        poster.mv(pathPosters, (err) => {
            if (err) {
                return res.status(500).json({'alert': 'Algo ha salido mal', 'status': 'error'})
            } 

            return res.status(200).json({'alert': 'Pelicula agregada exitosamente', 'status': 'success'})
        })
    },

    singleMovie: async (req, res) => {
        const session = (req.session.passport) ? req.session.passport.user : '',
            { rows } = await query(`SELECT * FROM "Pelicula" WHERE "idPelicula" = $1`, [req.params.id]),
            movies = await query(
                `SELECT 
                peliculas_has_director."idDirector", 
                pelicula_has_actor."idActor", 
                pelicula_has_productor."idProductor"
                FROM 
                public.pelicula_has_actor, 
                public.pelicula_has_productor, 
                public.peliculas_has_director
                WHERE peliculas_has_director."idPelicula" = $1;
                `, [req.params.id]);
                params = [movies.rows[0].idDirector, movies.rows[0].idActor, movies.rows[0].idProductor, rows[0].idCategoria]
        const people = await query(
            `SELECT 
            "Productor"."nombreProductor", 
            "Actor"."nombreActor", 
            "Actor"."apellidoActor", 
            "Director"."nombreDirector", 
            "Director"."apellidoDirector",
            "Categoria"."nombreCategoria"
            FROM 
            public."Director", 
            public."Actor", 
            public."Productor",
            public."Categoria"
            WHERE "Director"."idDirector" = $1 AND "Actor"."idActor" = $2 AND "Productor"."idProductor" = $3 AND "Categoria"."idCategoria" = $4;`, params)
 
        const comments = await query(
            `
            SELECT 
            "Comentario"."Comentario", 
            "Comentario"."idUsuario", 
            "Comentario"."idComentario", 
            "Usuario"."Correo"
            FROM 
            public."Comentario", 
            public."Usuario"
            WHERE 
            "Comentario"."idUsuario" = "Usuario"."idUsuario" AND "Comentario"."idPelicula" = $1
            `, [req.params.id])


        let totalScore = await query(
            `SELECT "Estrellas"
            FROM "Calificacion" 
            WHERE "idPelicula" = $1;`,[req.params.id]),
            score = 0,
            scored = totalScore.rows.length;
        
        for(star of totalScore.rows) {
            score += parseInt(star.Estrellas)
        }

        totalScore = Math.round(score / totalScore.rows.length)
        

        let favorite = false,
            myScore = 0
        if (req.session.passport) {
            const { rows } = await query(
                `SELECT 
                    peliculas_favoritas."idUsuario", 
                    peliculas_favoritas."idPeliculasFavoritas"
                FROM 
                    public.peliculas_favoritas
                WHERE 
                    peliculas_favoritas."idUsuario" = $1 AND peliculas_favoritas."idPelicula" = $2;
                `, [req.session.passport.user.idUsuario, req.params.id])

            favorite =  (rows.length === 0) ? !1 : !0

            myScore = await query(
                `SELECT "Estrellas"
                FROM "Calificacion" 
                WHERE "idUsuario" = $1 AND "idPelicula" = $2;`,[req.session.passport.user.idUsuario, req.params.id]);
            
            if(myScore.length > 0) {
                myScore = myScore.rows[0].Estrellas
                myScore = `star-${myScore}`
            } else {
                myScore = `star-0`
            }


        }
        
        res.render('single', {title:'Pelicula', session, rows, organization: people.rows, comments: comments.rows, favorite, totalScore, scored, myScore})
    },

    addFavoriteMovie: async (req, res) => {
        if(!req.session.passport) {
            return res.json({'alert': 'Tienes que iniciar sesión para poder añadirla a favoritos', 'status': 'error'})
        }
        
        const params = [1, req.session.passport.user.idUsuario, req.body.id]


        await query(`
            INSERT INTO peliculas_favoritas(
            "Privacidad", "idPeliculasFavoritas", "idUsuario", "idPelicula")
            VALUES ($1, DEFAULT, $2, $3);`, params)
        
        res.json({'alert': 'Se ha añadido a tu lista de peliculas favorita', 'status': 'success'})
    },

    addCommentMovie: async (req, res) => {

        const params = [req.body.comment, req.session.passport.user.idUsuario, req.body.idMovie]

        await query(
            `
            INSERT INTO "Comentario" 
            ("Comentario", "idUsuario", "idPelicula")
            VALUES ($1, $2, $3)`, params)
        res.json({'alert': 'Se ha añadido el comentario exitosamente', 'status': 'success', 'comment': true})
    },

    search: async (req, res) => {
        if(req.query.tipo === 'Pelicula') {
            const {rows} = await query(`SELECT * FROM "${req.query.tipo}" WHERE "nombrePelicula" LIKE $1`, [`%${req.query.valor}%`])
            res.json({rows, type: req.query.tipo})
        } else if (req.query.tipo === 'Actor') {
            const {rows} = await query(`SELECT * FROM "${req.query.tipo}" WHERE "nombreActor" LIKE $1 OR "apellidoActor" LIKE $1`, [`%${req.query.valor}%`])
            res.json({rows, type: req.query.tipo})
        } else if (req.query.tipo === 'Productor') {
            const {rows} = await query(`SELECT * FROM "${req.query.tipo}" WHERE "nombreProductor" LIKE $1`, [`%${req.query.valor}%`])
            res.json({rows, type: req.query.tipo})
        } else if (req.query.tipo === 'Director') {
            const {rows} = await query(`SELECT * FROM "${req.query.tipo}" WHERE "nombreDirector" LIKE $1 OR "apellidoDirector" LIKE $1`, [`%${req.query.valor}%`])
            res.json({rows, type: req.query.tipo})
        } else if (req.query.tipo === 'peliculas_favoritas') {
            const data = await query(`SELECT "idUsuario" FROM "Usuario" WHERE "Correo" = $1`, [req.query.valor])
            if(data.rows.length > 0) {
                const id = data.rows[0].idUsuario,
                    {rows}  = await query(
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
                        "Pelicula"."idPelicula" = peliculas_favoritas."idPelicula" AND peliculas_favoritas."idUsuario" = $1 AND peliculas_favoritas."Privacidad" = TRUE;`, [id]);
                    res.json({rows, type: req.query.tipo})
                } else {
                    res.json({rows: [], type: req.query.tipo})
                }
        }
    },

    dataMovie: async (req, res) => {
        const session = (req.session.passport) ? req.session.passport.user : '',
            categories = await query(`SELECT * FROM "Categoria"`),
            directors = await query(`SELECT * FROM "Director"`),
            actors = await query(`SELECT * FROM "Actor"`),
            productors = await query(`SELECT * FROM "Productor"`),
            {rows} = await query(`SELECT "nombrePelicula", "Resumen", "idCategoria" FROM "Pelicula" WHERE "idPelicula" = $1`, [req.params.id]),
            myActor = await query(`SELECT "idActor" FROM "pelicula_has_actor" WHERE "idPelicula" = $1`, [req.params.id]),
            myProductor = await query(`SELECT "idProductor" FROM "pelicula_has_productor" WHERE "idPelicula" = $1`, [req.params.id]),
            myDirector = await query(`SELECT "idDirector" FROM "peliculas_has_director" WHERE "idPelicula" = $1`, [req.params.id]);
        res.render('edit_movie', {title: 'Editar película', myActor,myProductor,myDirector, rows, session, categories: categories.rows, directors: directors.rows, actors: actors.rows, productors: productors.rows})
    },

    editMovie: async (req, res) => {
        let params = [req.body.actor, req.body.id]
        await query(
            `UPDATE pelicula_has_actor
            SET "idActor"=$1
            WHERE "idPelicula" = $2;`, params)

        params[0] = req.body.productor
        await query(
            `UPDATE pelicula_has_productor
            SET "idProductor"=$1
            WHERE "idPelicula" = $2;`, params)

        params[0] = req.body.director
        await query(
            `UPDATE peliculas_has_director
            SET "idDirector"=$1
            WHERE "idPelicula" = $2;`, params)

        if(!req.files) {
            params = [req.body.title, req.body.summary, req.body.category, req.body.id]
            await query(
                `UPDATE "Pelicula"
                SET "nombrePelicula" = $1, "Resumen"=$2, 
                "idCategoria"=$3
                WHERE "idPelicula" = $4;`, params)
        } else {
            const nameImage = `${req.files.poster.md5}.png`,
            pathPosters = path.join(__dirname, '../', '../','assets', 'img', 'posters', nameImage),
            poster = req.files.poster;
            
            params = [req.body.title, req.body.summary, req.body.category, nameImage, req.body.id]
            await query(
                `UPDATE "Pelicula"
                SET "nombrePelicula" = $1, "Resumen"=$2, "idCategoria"=$3, "fotoPoster"=$4
                WHERE "idPelicula" = $5;`, params)

            poster.mv(pathPosters, (err) => {
                if (err) {
                    return res.status(500).json({'alert': 'No se pudo editar la película', 'status': 'error'})
                } 

                return res.status(200).json({'alert': 'Película editada exitosamente', 'status': 'success'})
            })
        }
    },

    deleteMovie: async (req, res) => {
        await query(
            `DELETE FROM "pelicula_has_productor"
            WHERE "idPelicula" = $1;`, [req.body.id]
        )
        await query(
            `DELETE FROM "pelicula_has_actor"
            WHERE "idPelicula" = $1;`, [req.body.id]
        )
        await query(
            `DELETE FROM "peliculas_has_director"
            WHERE "idPelicula" = $1;`, [req.body.id]
        )
        await query(
            `DELETE FROM "Usuario_has_Pelicula"
            WHERE "idPelicula" = $1;`, [req.body.id]
        )
        await query(
            `DELETE FROM "peliculas_favoritas"
            WHERE "idPelicula" = $1;`, [req.body.id]
        )
        await query(
            `DELETE FROM "Pelicula"
            WHERE "idPelicula" = $1;`, [req.body.id])
        res.json({'alert': 'Película eliminada exitosamente', 'status': 'success'})
    },

    addScore: async (req, res) => { 
        if(!req.session.passport) {
            return res.json({'alert': 'Debes iniciar sesión', 'status': 'error'})
        }
        const {rows} = await query(
            `SELECT "Estrellas", "idCalificacion", "idPelicula", "idUsuario"
            FROM "Calificacion" 
            WHERE "idUsuario" = $1 AND "idPelicula" = $2;`,[req.session.passport.user.idUsuario, req.body.id])

        if(rows.length === 0) {
            await query(`
            INSERT INTO "Calificacion"(
            "Estrellas", "idCalificacion", "idPelicula", "idUsuario")
            VALUES ($1, DEFAULT, $2, $3);
            `, [req.body.score, req.body.id, req.session.passport.user.idUsuario])
        } else {
            await query(
                `UPDATE "Calificacion"
                SET "Estrellas"=$1
                WHERE "idUsuario" = $3 AND "idPelicula" = $2;`, [req.body.score, req.body.id, req.session.passport.user.idUsuario])
        }
        res.json({'alert': 'Calificación agregada exitosamente', 'status': 'success'})
    }
}