module.exports = function (req, res, next) {
    if (req.body.token == undefined) {
        next()
    } else {
        res.status(403).json({ message: 'Not allowed' })
    }
}