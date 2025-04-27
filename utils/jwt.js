// utils/jwt.js
const jwt = require('jsonwebtoken');

function generateJWT(user) {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    if (!token) {
        throw new Error('Failed to generate token');
    }
    return token;
}

function verifyJWT(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded : ", decoded);
        if (!decoded) {
            throw new Error('Failed to verify token');
        }
        return decoded;
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    generateJWT,
    verifyJWT
};
