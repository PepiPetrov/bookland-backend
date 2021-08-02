const router = require('express').Router()
const authRouter = require('../routes/auth')
const booksRouter = require('../routes/book')
const commentsRouter = require('../routes/comment')

router.use('/auth', authRouter)
router.use('/books', booksRouter)
router.use('/comments', commentsRouter)

module.exports = router