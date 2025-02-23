const jwt = require('jsonwebtoken')
const env = require('../config/env')

// Ce middleware vérifie l'authentification via un token JWT.
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]//Recuperation du token dans l’entête authorization (split pour le token uniquement sans le mot bearer)
        const decodedToken = jwt.verify(token, env.JWT_SECRET)//Verification du token via verify
        const userId = decodedToken.userId
        req.auth = {
            userId: userId//Recuperation de l'id issue du decodage du token
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}