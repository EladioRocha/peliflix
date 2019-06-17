const LocalStrategy = require('passport-local').Strategy,
    path = require('path'),
    passport = require('passport'),
    database = path.join(__dirname, '../', 'api', 'database', 'index'),
    { query } = require(database);


passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    let params = [req.body.email],
        text = `SELECT "Correo" from "Usuario" WHERE "Correo" = $1`,
        { rows } = await query(text, [req.body.email])
    if (rows.length > 0) {
        req.passportMessage = 'Ya existe el correo electronico intente con otro'
        return done(null, false)
    } else {
        params = [req.body.firstName, req.body.lastName, req.body.password, req.body.email, req.body.address, req.body.birthdate, req.body.gender, req.body.telephone]
        text = 
        `INSERT INTO "Usuario"(
        "Nombre", "Apellido", "Contraseña", "Correo", "Direccion", fecha_nacimiento, 
        "Genero", "idUsuario", telefono)
        VALUES ($1, $2, $3, $4, $5, $6, 
        $7, DEFAULT, $8);
        `
        await query(text, params)
        req.passportMessage = 'Registro exitoso'
        done(null, params)
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    let params = [req.body.email],
        text = `SELECT "Correo" FROM "Usuario" WHERE "Correo" = $1`,
        { rows } = await query(text, params);

        if(rows.length === 0) {
            done(null, false)
        } else {
            text = `SELECT * FROM "Usuario" WHERE "Correo" = $1 AND "Contraseña" = $2`
            params = [req.body.email, req.body.password]
            const { rows } = await query(text, params)
            if (rows.length === 0) {
                done(null, false)
            } else {
                return done(null, rows[0])
            }
        }
}))