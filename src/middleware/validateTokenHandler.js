import jwt from 'jsonwebtoken';

export const validateToken = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.Authorization || req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.vendor = decoded.vendor;
            console.log(decoded);
            next();
        } else {
            res.status(401);
            new Error('Invalid Token');
        }
    } catch (error) {
        res.status(401);
        throw new Error('Invalid Token');
    }
});
