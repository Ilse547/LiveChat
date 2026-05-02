const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
    const auth = req.headers.authorization;


    if(!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                code: 'auth.token.missing',
                message: 'authorization token missing'
            }
        });
    }
    const token = auth.slice('Bearer '.length);

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        return next();
    } catch(err){
        return res.status(401).json({
            error:{
                code: 'auth.token.invalid',
                message:'Invalid or expired'
            }
        });
    }
};
module.exports = { VerifyToken };
