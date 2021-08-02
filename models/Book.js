const { Schema, model } = require('mongoose')

const schema = new Schema({
    title: {
        unique: true,
        type: String
    },
    author: String,
    year: Number,
    rating: Number,
    description: String,
    linkToBuy: {
        type: String,
        required: false
    },
    img: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    liked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    ]
})

module.exports = model('Book', schema)