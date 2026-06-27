export function comprobarToken(req, res, next) {
    try {
        const token = req.signedCookies['token']

        if (!token) {
            return res.redirect('/login')
        }

        jwt.verify(token, process.env.FIRMA_JWT, (error, payload) => {
            if (error) {
                // El token expiró o fue manipulado
                console.error(error)
                return res.redirect('/login')
            }

            next()
        })
    } catch (error) {
        console.error('Error crítico en middleware comprobarToken:', error)
        return res.redirect('/login')
    }
}