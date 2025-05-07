import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    // Always set CORS headers first
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, dtoken, atoken');

    try {
        const { atoken } = req.headers;
        if (!atoken) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ success: false, message: 'Access Denied' });
        }

        next();
    } catch (error) {
        console.log("Auth error:", error);
        res.status(401).json({ success: false, message: error.message });
    }
};

export default authAdmin;
