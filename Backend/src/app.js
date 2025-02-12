const express = require('express')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const { getBookByRating } = require('./utils/booksUtils')

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

//Recuperation de tout les livres
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find()
        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

//Reucuperation des 3 meilleur livre ⚠️ A placer avant /books/:id sinon => interpréter comme un id
app.get('/api/books/bestrating', async (req, res) => {
    try {
        const books = await Book.find()
        const top3Books = getBookByRating(books)
        res.status(200).json(top3Books)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

//Recuperation d'un livre unique par id
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id })
        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//Ajout d'un nouveau livre
app.post('/api/books', async (req, res) => {
    try {
        const book = await new Book({
            ...req.body
        })

        await book.save()
        res.status(201).json({ message: 'Livre enregistré !' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.post('/api/books/:id/rating', async (req, res) => {
    try {
        const book = await new Book({
            ...req.body
        })

        await book.save()
        res.status(201).json({ message: 'Livre enregistré !' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.put('/api/books/:id', async (req, res) => {
    try {
        await Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        res.status(200).json({ message: 'Livre modifié !' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.delete('/api/books/:id', async (req, res) => {
    try {
        await Book.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: 'Livre supprimé !' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

mongoose.connect('mongodb+srv://jo8dev:jo8@monvieuxgrimoire.nh7zq.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

module.exports = app;