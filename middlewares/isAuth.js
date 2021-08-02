module.exports = function (req, res, next) {
    if (req.body.token !== undefined || req.query.token !== undefined) {
        next()
    } else {
        res.status(401).json({ message: 'Not authorized' })
    }
}