const env = require('./config/env')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const bookRoutes = require('./routes/bookRoutes')
const userRoutes = require('./routes/userRoutes')

// Connexion à la base de données MongoDB avec l'URI défini dans les variables d'environnement
mongoose.connect(env.MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

// Middleware pour parser le JSON dans les requêtes (intercepte toutes les requêtes JSON)
app.use(express.json())

// Middleware pour autoriser les requêtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

// Route pour servir les fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, '../images')))

// Routes pour les livres et les utilisateurs
app.use('/api/auth', userRoutes)
app.use('/api/books', bookRoutes)



module.exports = app
