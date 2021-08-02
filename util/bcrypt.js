const bcrypt = require('bcrypt')
const { SALT_ROUNDS } = require('../config')

async function hash(pass) {
    return await bcrypt.hash(pass, SALT_ROUNDS)
}

async function compare(pass, hash) {
    return await bcrypt.compare(pass, hash)
}

module.exports = { hash, compare }