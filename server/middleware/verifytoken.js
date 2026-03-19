const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
    const BearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if(err) {
                return res.status(403).json({ message : 'Invalid token'});
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({message : 'token not provided ???'});
    }
}
module.exports = { VerifyToken };
