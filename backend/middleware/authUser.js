import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const token =
        req.headers['authorization']?.split(' ')[1] || req.headers['token'];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized: Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
