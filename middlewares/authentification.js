const jwt = require('jsonwebtoken')

require('dotenv').config();

function authentification(req, res, next) {
    // Il faut que je récupère le token qui à été générer dans le api/login pour pouvoir le comparé avec un autre s'il est bon
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    // authHeader.split(' ') => ["Bearer", "<token>"]
    // authHeader.split(' ')[1] => ["<token>"]
    if (token == null) return res.status(401).json({ message: 'Token manquant' })
    // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //     if (err) {
    //         return res.status(401)
    //     }
    //     req.user = user;
    //     next()
    // });
    // doesnt work
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token invalide' })
    }
}

module.exports = authentification;

// Le token de l'API ce trouve directement dans l'en tête donc dans le header c'est donc ici qu'on va venir le récupérer
// Le token est généralement une chaîne au format Bearer, donc on iras le chercher là bas par l'utilisateur