const { connect } = require('mongoose')
const model = require('../models/Book')
const Comment = require('../models/Comment')
const User = require('../models/User')
const jwt = require('../util/jwt')

connect('mongodb://localhost/books', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
})

async function getAll(req, res) {
    res.json(await model.find({}).lean()).end()
}

async function getOne(req, res) {
    const resBook = await model.findById(req.params.id).populate('comments').lean()
    res.json(resBook).end()
}

async function create(req, res) {
    if (req.body.token) {
        const books = await model.find({ title: req.body.book.title })
        if (books.length > 0) {
            res.status(409).json({ message: 'Book title must be unique!' }).end()
            return
        }
        try {
            delete req.body.book['_id']
            req.body.book.creator = jwt.decode(req.body.token).user._id
            req.body.book.comments = []
            console.log(req.body.book);
            const book = await model.create(req.body.book)
            res.status(201).end()
        } catch (e) {
            res.status(403).json({ message: e.message }).end()
        }
    } else {
        res.status(401).json({ message: 'Please login' }).end()
    }
}

async function edit(req, res) {
    if (req.body.token) {
        if (jwt.decode(req.body.token).user._id == (await model.findById(req.params.id)).creator) {
            try {
                await model.findByIdAndUpdate(req.params.id, req.body.book)
                res.status(200)
            } catch (e) {
                res.status(403).json({ message: e.message })
            }
        } else {
            res.status(403).json({ message: 'You are not owner' })
        }
    } else {
        res.status(401).json({ message: 'Please login' })
    }
    res.end()
}

async function remove(req, res) {
    if (req.body.token !== undefined) {
        if (jwt.decode(req.body.token).user._id == (await model.findById(req.params.id)).creator) {
            try {
                await model.findByIdAndRemove(req.params.id)
                await Comment.deleteMany({ bookId: req.params.id })
            } catch (e) {
                res.status(403).json({ message: e.message })
            }
        } else {
            res.status(403).json({ message: 'You are not owner' })
        }
        res.end()
    } else {
        res.status(401).json({ message: 'Please login' }).end()
    }

}

async function searchByName(req, res) {
    res.json((await model.find().lean()).filter(x => x.title.toLocaleLowerCase().includes(req.body.name.toLocaleLowerCase())))
}

async function searchByYear(req, res) {
    res.json((await model.find().lean()).filter(x => x.year == req.body.year))
}

async function searchByAuthor(req, res) {
    res.json((await model.find().lean()).filter(x => x.author.toLocaleLowerCase().includes(req.body.author.toLocaleLowerCase())))
}

async function getUserLikedBooks(req, res) {
    if (req.query.token) {
        res.json((await User.findById(jwt.decode(req.query.token).user._id).populate('favouriteBooks').lean()).favouriteBooks).end()
    } else {
        res.status(401).json({ message: 'Please login' }).end()
    }
}

async function getUserCreatedBooks(req, res) {
    if (req.query.token) {
        res.json((await model.find({ creator: jwt.decode(req.query.token).user._id }).lean())).end()
    } else {
        res.status(401).json({ message: 'Please login' }).end()
    }
}

async function like(req, res) {
    if (req.body.token) {
        try {
            const bookId = req.params.id
            const userId = jwt.decode(req.body.token).user._id
            const user = await User.findById(userId)
            const book = await model.findById(bookId)
            user.favouriteBooks.push(bookId)
            await User.findByIdAndUpdate(userId, user)
            book.liked.push(userId)
            await model.findByIdAndUpdate(bookId, book)
            res.status(200).end()
        } catch (e) {
            res.json(jwt.decode(req.body.token)).end()
        }
    } else {
        res.status(401).json({ message: 'Please login' }).end()
    }
}

module.exports = { getAll, getOne, create, edit, remove, searchByName, searchByYear, getUserLikedBooks, like, searchByAuthor, getUserCreatedBooks }