const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const imagesDir = path.join(__dirname, '../../images')
const storage = multer.memoryStorage() // Stocke l'image en mémoire
const upload = multer({ storage }).single("image")

module.exports = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Erreur lors de l'upload" })
        }

        if (!req.file) {
            return next()
        }

        const timestamp = Date.now()
        const filename = `image_${timestamp}.webp` // Nom du fichier
        const outputPath = path.join(__dirname, "../../images", filename) // Chemin de sortie

        // Vérification et création du répertoire images s'il n'existe pas
        fs.access(imagesDir, (error) => {
            if (error) {
                fs.mkdirSync(imagesDir)
            }
        })

        try {
            await sharp(req.file.buffer)
                .webp({ quality: 20 })
                .toFile(outputPath)

            req.file.filename = filename // Modifie le nom du fichier pour qu'il soit récupérable dans `createBook`
            next()
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la conversion de l'image" })
        }
    })
}