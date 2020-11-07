const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers['access-token'];
    if(!token) return res.send('Access denied')

    try {
        const verify = jwt.verify(token, process.env.SECRET)
        req.user = verify;
        next()
    } catch (err) {
        res.status(401).send('Invalid Access Token')
    }
}

module.exports = verifyToken