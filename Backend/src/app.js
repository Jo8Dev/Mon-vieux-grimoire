require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const express = require('express')
const mongoose = require('mongoose')

const bookRoutes = require('./routes/bookRoutes')

// Connexion à la base de données MongoDB avec l'URI défini dans les variables d'environnement
// Si la connexion réussit, on affiche un message de succès, sinon un message d'erreur
mongoose.connect(process.env.MONGO_URI)
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
});

app.use('/api/books', bookRoutes)

module.exports = app;
