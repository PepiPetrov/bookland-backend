const router = require('express').Router()
const controller = require('../controllers/authController')
const isGuest = require('../middlewares/isGuest')
const isAuth = require('../middlewares/isAuth')

router.post('/register', isGuest, controller.register)
router.post('/login', isGuest, controller.login)
router.post('/logout', isAuth, controller.logout)
router.get('/isLogged', (req, res) => {
    res.json({ token: req.session.token !== '' ? req.session.token : undefined })
})

module.exports = router