const { connect } = require('mongoose')
const model = require('../models/Comment')
const Book = require('../models/Book')
const jwt = require('../util/jwt')

connect('mongodb+srv://pepi:pepi@bookland.uowng.mongodb.net/bookland?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
})

async function addComment(req, res) {
    if (req.body.token) {
        try {
            const comment = req.body.comment
            const user = jwt.decode(req.body.token).user._id
            comment.author = user
            comment.bookId = req.params.bookId
            delete comment['_id']
            const commentId = (await model.create(comment))._id
            const book = await Book.findById(req.params.bookId)
            book.comments.push(commentId)
            await Book.findByIdAndUpdate(req.params.bookId, book)
            res.status(201).end()
        } catch (e) {
            res.json(e)
        }
    } else {
        res.status(401).json({ message: 'Please login' }).end()
    }
}

async function editComment(req, res) {
    if (req.body.token) {
        const authorId = (await model.findById(req.params.id)).author
        const userId = jwt.decode(req.body.token).user._id
        req.body.comment.author = authorId
        delete req.body.comment['_id']
        if (authorId == userId) {
            await model.findByIdAndUpdate(req.params.id, req.body.comment)
        }
        res.status(201).end()
    } else {
        res.status(401).json({ message: 'Please login' }).end()
    }
}

async function removeComment(req, res) {
    if (req.body.token) {
        const authorId = (await model.findById(req.params.id)).author
        const userId = jwt.decode(req.body.token).user._id
        if (authorId == userId) {
            await model.findByIdAndRemove(req.params.id)
        }
        res.status(200).end()
    } else {
        res.status(401).json({ message: 'Please login' }).end()
    }
}

module.exports = { addComment, editComment, removeComment }
