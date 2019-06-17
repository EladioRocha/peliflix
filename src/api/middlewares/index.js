module.exports = authorization = {
    authorization: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    },

    isLogged: (req, res, next) => {
        if(req.isAuthenticated()) {
            res.redirect('/chat')
        }

        return next();
    }
}