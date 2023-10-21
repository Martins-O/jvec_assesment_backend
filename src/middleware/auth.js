import {CustomerModel} from "../models/contactModel.js";
import {verifyToken} from "../utils/jwt.js";
import {sendErrorResponse} from "../customError/error.js";

export const customerAuthJwt = async (req, res, next) => {
    try {
        if (req.header('auth_token')) {
            const token = req.header('auth_token');
            if (!token) return res.status(401).json({ message: 'Access denied, you need a token' });

            const verified = verifyToken(token);
            const user = await CustomerModel.findById(verified._id)
            if (!user) return sendErrorResponse(res, 401, 'unauthorized access');

            req.user = user;
            next();

        } else {
            if (!req.user) {
                return sendErrorResponse(res, 400, "Session invalid, please try login again!")
            } else {
                next();
            }
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid Token' });
    }

}