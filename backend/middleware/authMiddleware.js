import jwt from 'jsonwebtoken';
import expressHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = expressHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //this will set the current active user to be used on all protected routes
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not Authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not Authorized, no token');
    }
})

export { protect }