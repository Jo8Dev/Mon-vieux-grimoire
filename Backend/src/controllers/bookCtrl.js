const Book = require('../models/Book')
const fs = require('fs').promises

//Recuperation de tout les livres
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find()
        if (!books) {
            return res.status(404).json({ message: 'Aucun livre trouvé' })
        }
        res.status(200).json(books)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Recuperation des 3 livres les mieux classé
exports.bestRatedBooks = async (req, res) => {
    try {
        const top3Books = await Book.find().sort({ averageRating: -1 }).limit(3) //On récupère tous les livres, on les classe par note moyenne décroissante, et on garde seulement les 3 premiers
        res.status(200).json(top3Books)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Recuperation d'un livre unique
exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id })
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' })
        }
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Création d'un nouveau livre
exports.createBook = async (req, res) => {
    try {
        const bookObject = JSON.parse(req.body.book) // Conversion de l'objet JSON en objet JavaScript
        delete bookObject._id // Suppression de l'ID car MongoDB en génère un automatiquement
        delete bookObject._userId // Suppression de l'userId pour éviter une modification frauduleuse

        const book = new Book({
            ...bookObject, // On récupère les informations du livre
            userId: req.auth.userId, // On ajoute l'ID de l'utilisateur qui a créé le livre
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // On ajoute l'URL de l'image
        })

        await book.save()

        res.status(201).json({ message: 'Livre enregistré !' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//MAJ d'un livre
exports.updateBook = async (req, res) => {
    try {

        const bookObject = req.file ? { //Si un fichier est envoyé, on crée un nouvel objet avec les informations du livre et l'url de l'image
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body } //Sinon, on crée un nouvel objet avec les informations du livre

        delete bookObject._userId // Suppression de l'userId pour éviter une modification frauduleuse

        const book = await Book.findOne({ _id: req.params.id }) //On récupère le livre à modifier

        //On vérifie si l'utilisateur est bien le propriétaire du livre
        if (book.userId !== req.auth.userId) {
            return res.status(403).json({ message: 'Requête non autorisée' })
        }
        //On vérifie si le livre existe
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' })
        }

        //On vérifie si un fichier est envoyé ou non pour supprimer l'ancienne image
        if (req.file) {
            const filename = book.imageUrl.split('/images/')[1]//On récupère le nom du fichier à supprimer
            await fs.unlink(`images/${filename}`)//On supprime le fichier
        }

        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id }) //On met à jour le livre avec les nouvelles informations
        res.status(200).json({ message: 'Livre modifié !' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Suppression d'un livre
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id })

        // Vérifie si l'utilisateur est bien le propriétaire du livre
        if (book.userId !== req.auth.userId) {
            return res.status(403).json({ message: 'Requête non autorisée' })
        }

        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' })
        }

        const filename = book.imageUrl.split('/images/')[1]

        // Suppression du fichier image
        await fs.unlink(`images/${filename}`)

        // Suppression du livre dans la base de données
        await Book.deleteOne({ _id: req.params.id })

        res.status(200).json({ message: 'Livre supprimé !' })

    } catch (error) {
        console.error("Erreur lors de la suppression :", error)
        res.status(500).json({ error: error.message })
    }
}

//Notation d'un livre et calcul de la note moyenne
exports.ratingBook = async (req, res) => {
    try {
        const rating = Number(req.body.rating) // Convertir la note en nombre

        // Vérification de la validité de la note
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "La note doit être un nombre entre 1 et 5" })
        }

        // Trouver le livre
        const book = await Book.findOne({ _id: req.params.id })

        // Vérifier si le livre existe
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" })
        }

        // Vérifier si l'utilisateur a déjà noté ce livre
        const userRating = book.ratings.find(rating => rating.userId === req.auth.userId)

        if (userRating) {
            return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
        }
        book.ratings.push({ userId: req.auth.userId, grade: rating });


        // Calculer la note moyenne
        const averageRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0) / book.ratings.length
        book.averageRating = averageRating

        // Sauvegarder le livre avec la nouvelle note
        await book.save()

        // Réponse avec message et ID du livre
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}