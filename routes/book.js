const router = require('express').Router()
const controller = require('../controllers/bookController')
const isAuth = require('../middlewares/isAuth')

router.get('/all', controller.getAll)
router.get('/profile', isAuth, controller.getUserLikedBooks)
router.get('/created', isAuth, controller.getUserCreatedBooks)
router.get('/:id', controller.getOne)
router.post('/search/year', controller.searchByYear)
router.post('/search/author', controller.searchByAuthor)
router.post('/search/name', controller.searchByName)
router.post('/create', controller.create)
router.post('/like/:id', isAuth, controller.like)
router.put('/edit/:id', isAuth, controller.edit)
router.delete('/remove/:id', isAuth, controller.remove)

module.exports = router