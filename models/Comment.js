const { Schema, model } = require('mongoose')


const schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }
})

module.exports = model('Comment', schema)