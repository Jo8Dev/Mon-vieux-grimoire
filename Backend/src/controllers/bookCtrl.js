const Book = require('../models/Book')
const { getBookByRating } = require('../utils/booksUtils')


//Recuperation de tout les livres
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find()
        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//Recuperation des 3 livres les mieux classé
exports.bestRatedBooks = async (req, res) => {
    try {
        const books = await Book.find()
        const top3Books = getBookByRating(books)
        res.status(200).json(top3Books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//Recuperation d'un livre unique
exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id })
        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//Création d'un nouveau livre
exports.createBook = async (req, res) => {
    try {
        const book = await new Book({
            ...req.body
        })

        await book.save()
        res.status(201).json({ message: 'Livre enregistré !' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//MAJ d'un livre
exports.updateBook = async (req, res) => {
    try {
        await Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        res.status(200).json({ message: 'Livre modifié !' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//Suppression d'un livre
exports.deleteBook = async (req, res) => {
    try {
        await Book.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: 'Livre supprimé !' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//⚠️⚠️⚠️Non fonctionel pour l'instant
exports.ratingBook = async (req, res) => {

}