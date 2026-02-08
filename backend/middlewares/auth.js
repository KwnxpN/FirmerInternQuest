import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {

    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided, please log in.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token is invalid' });
    }
}

export function adminMiddleware(req, res, next) {
    if (req.user && req.user.level === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}