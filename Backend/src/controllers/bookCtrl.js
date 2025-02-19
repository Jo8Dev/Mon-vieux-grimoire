const Book = require('../models/Book')
const { getBookByRating } = require('../utils/booksUtils')
const fs = require('fs').promises


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
        const bookObject = JSON.parse(req.body.book)
        delete bookObject._id
        delete bookObject._userId

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })

        await book.save();

        res.status(201).json({ message: 'Livre enregistré !' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//MAJ d'un livre
exports.updateBook = async (req, res) => {
    try {
        const bookObject = req.file ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }

        delete bookObject._userId

        const book = await Book.findOne({ _id: req.params.id })
        if (book.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Non-autorisé' })
        }

        await Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        res.status(200).json({ message: 'Livre modifié !' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//Suppression d'un livre
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        if (book.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Non-autorisé' });
        }

        const filename = book.imageUrl.split('/images/')[1];

        // Suppression du fichier image
        await fs.unlink(`images/${filename}`);

        // Suppression du livre dans la base de données
        await Book.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Livre supprimé !' });

    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(400).json({ error: error.message });
    }
}

//⚠️⚠️⚠️Non fonctionel pour l'instant
exports.ratingBook = async (req, res) => {

}