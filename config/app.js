const express = require('express')
const session = require('express-session')
const bp = require('body-parser')
const cors = require('cors')
const router = require('./routes')

const app = express()

app.use(cors({
    origin: ['http://localhost:4200']
}))

app.use(session({
    saveUninitialized: false,
    secret: 'booksapi',
    resave: true
}))

app.use(bp({ extended: true }))

app.use('/api', router)

module.exports = app