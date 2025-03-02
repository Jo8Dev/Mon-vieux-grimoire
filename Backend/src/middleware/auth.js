const jwt = require('jsonwebtoken')
const env = require('../config/env')

// Ce middleware vérifie l'authentification via un token JWT.
module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization // Récupère le header Authorization
        if (!authorizationHeader) {
            throw new Error('Token manquant') // Si le header n'existe pas, on renvoie une erreur
        }

        const token = authorizationHeader.split(' ')[1] // Récupère le token
        if (!token) {
            throw new Error('Format du token invalide')// Si le token n'existe pas, on renvoie une erreur
        }

        const decodedToken = jwt.verify(token, env.JWT_SECRET) // On vérifie le token
        req.auth = { userId: decodedToken.userId }    // On extrait l'ID utilisateur du token

        next()
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}