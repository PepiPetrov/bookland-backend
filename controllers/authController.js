const { connect } = require('mongoose')
const model = require('../models/User')
const bcrypt = require('../util/bcrypt')
const token = require('../util/jwt')

connect('mongodb+srv://pepi:pepi@bookland.uowng.mongodb.net/bookland?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
})

async function register(req, res) {
    const user = req.body.user
    user.password = await bcrypt.hash(user.password)
    const exists = Array(await model.find({ username: user.username })).length == 1
    if (exists) {
        try {
            const userCreated = await model.create(user)
            res.status(201).json({ message: 'Success', token: token.encode(userCreated), userId: userCreated._id })
        } catch (e) {
            res.status(409).json({ message: 'Username and email must be unique!' })
        }
    } else {
        res.status(409).json({ message: 'Username and email must be unique!' })
    }
    res.end()
}

async function login(req, res) {
    const user = req.body.user
    const findByUsername = await model.find({ username: user.username, email: user.email }).lean()
    const findByPass = findByUsername.filter(x => bcrypt.compare(user.password, x.password))[0]
    if (findByPass == undefined) {
        res.status(404).json({ message: 'User not found!' }).end()
        return
    }
    res.status(201).json({ message: 'Success', token: token.encode(findByPass), userId: findByPass._id }).end()
}

function logout(req, res) {
    res.status(401).json({ message: 'Success' }).end()
}

module.exports = { login, register, logout }
