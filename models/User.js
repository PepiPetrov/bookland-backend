const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    favouriteBooks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }
    ],
    email: String
})

module.exports = model('User', schema)