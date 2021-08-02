const router = require('express').Router()
const controller = require('../controllers/commentController')

router.post('/create/:bookId', controller.addComment)
router.put('/:id', controller.editComment)
router.delete('/:id', controller.removeComment)


module.exports = router