const jwt = require('jsonwebtoken');
const User = require('../models/')['user']

function extractToken(req) {
    if (req.headers.authorization) {
        return req.headers.authorization;
    }
    return null;
}

const authmiddleware = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decoded) {
        if (err) {
            return res.status(500).send({
                message: "Unauthorized!"
            });
        }

        const authUser = await User.findByPk(decoded.id);
        if (!authUser) {
            return res.status(401).send({
                result: false,
                message: "Not Found User"
            })
        }
        req.user = authUser;
        next();
    });

}

module.exports = authmiddleware;