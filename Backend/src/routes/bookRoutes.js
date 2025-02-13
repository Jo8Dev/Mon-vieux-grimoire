const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/bookCtrl')

router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', bookCtrl.bestRatedBooks) //⚠️ A placer avant /books/:id sinon => interpréter comme un id
router.get('/:id', bookCtrl.getOneBook)
router.post('/', bookCtrl.createBook)
router.post('/:id/rating', bookCtrl.ratingBook)
router.put('/:id', bookCtrl.updateBook)
router.delete('/:id', bookCtrl.deleteBook)

module.exports = router