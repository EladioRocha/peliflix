const path = require('path'),
    database = path.join(__dirname, '../', 'database', 'index')
    passport = require('passport');

const { query } = require(database)  

module.exports = {
    changePassword: async (req, res) => {
        const { rows } = await query(`SELECT "Contraseña" FROM "Usuario" WHERE "Contraseña" = $1 AND "idUsuario" = $2`, [req.body.currentPassword, req.session.passport.user.idUsuario])
        console.log(rows)
        if(rows.length === 0) {
            return res.json({'alert': 'La contraseña actual es incorrecta'})
        } else {
            await query(`UPDATE "Usuario" SET "Contraseña"=$1 WHERE "idUsuario"=$2;`, [req.body.newPassword, req.session.passport.user.idUsuario])
        }

        return res.json({'alert': 'La contraseña se ha cambiado con exito'})
    },

    editProfile: async (req, res) => {
        let params = [req.body.email, req.body.address, req.body.gender, req.body.telephone, req.session.passport.user.idUsuario]
        await query(
            `UPDATE "Usuario"
            SET "Correo"=$1, "Direccion"=$2, "Genero"=$3, telefono=$4
            WHERE "idUsuario" = $5;`, params)

        req.session.passport.user.Correo = req.body.email
        req.session.passport.user.Direccion = req.body.address
        req.session.passport.user.telefono = req.body.telephone
        req.session.passport.user.Genero = !!req.body.gender

        res.json({'alert': 'Se han cambiado tus datos exitosamente'})
    },

    editPrivacityMovie: async (req, res) => {
        await query(
            `UPDATE peliculas_favoritas
            SET "Privacidad"=$1
            WHERE "idPelicula" = $2 AND "idUsuario" = $3;`, [req.body.privacity, req.body.id, req.session.passport.user.idUsuario])
        res.json({'alert': 'Se ha cambiado la privacidad de la película'})
    },

    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
}