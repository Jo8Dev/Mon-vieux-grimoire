const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const imagesDir = path.join(__dirname, '../../images') // Chemin du répertoire images
const storage = multer.memoryStorage() //  configure le stockage en mémoire plutôt que sur le disque, afin de la manipuler avant de l'enregistrer.
const upload = multer({ storage }).single("image") // single("image") indique que l'on attend un fichier unique nommé "image"

module.exports = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Erreur lors de l'upload" })
        }

        if (!req.file) {
            return next()
        }

        const originalName = req.file.originalname.split(" ").join("_") // Nom original du fichier avec les espaces remplacés par des underscores
        const timestamp = Date.now() // Timestamp pour nommer le fichier
        const filename = `image_${originalName}${timestamp}.webp` // Nom du fichier
        const outputPath = path.join(__dirname, "../../images", filename) // Chemin de sortie


        // Vérification et création du répertoire images s'il n'existe pas
        fs.access(imagesDir, (error) => {
            if (error) {
                fs.mkdirSync(imagesDir)
            }
        })

        try {
            await sharp(req.file.buffer) // Utilisation de sharp pour manipuler l'image
                .webp({ quality: 20 }) // Conversion de l'image en format webp avec une qualité de 20
                .toFile(outputPath) // Enregistrement de l'image

            req.file.filename = filename // Ajout du nom du fichier à la requête pour l'enregistrement en base de données
            next()
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la conversion de l'image" })
        }
    })
}