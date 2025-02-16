const express = require('express')
const bookCtrl = require('../controllers/bookCtrl')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', bookCtrl.bestRatedBooks) //⚠️ A placer avant /books/:id sinon => interpréter comme un id
router.get('/:id', bookCtrl.getOneBook)
router.post('/', auth, bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.ratingBook)
router.put('/:id', auth, bookCtrl.updateBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router