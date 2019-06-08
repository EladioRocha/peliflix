module.exports = {
    index: (req, res) => {
        res.render('index', {title: 'Inicio'})
    },

    pageNotFound: (req, res) => {
        res.render('404', {title: 'Página no encontrada'})
    }
}