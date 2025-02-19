const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

exports.signup = async (req, res, next) => {
    try {
        //Condition pour verifier que le mdp est présent et non vide
        if (!req.body.password && req.body.password.trim() === "") {
            return res.status(401).json({ error: "mots de passe invalide" })
        }
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            email: req.body.email,
            password: hash
        })
        await user.save()
        res.status(201).json({ message: "Nouvel utilisateur créé!" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }


}

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
        }

        const valid = await bcrypt.compare(req.body.password, user.password)

        if (!valid) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
        }

        res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        });
    } catch (error) {
        res.status(500).json({ error })
    }
};