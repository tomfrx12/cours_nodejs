// btw c'est comme react, un composant réutilisable a l'infinie

module.exports = function validation(schema, property = 'body') {
    return ( req, res, next) => {
        const result = schema.safeParse(req[property])
        if (!result.success) return res.status(400).json({ errors: result.error.flatten() })
        req.validated = result.data
        next()
    }
}