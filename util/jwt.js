const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../config')

function encode(user) {
    return jwt.sign({ user }, TOKEN_SECRET, { expiresIn: 86400000 })
}

function decode(token) {
    return jwt.verify(token, TOKEN_SECRET)
}

module.exports = { encode, decode }