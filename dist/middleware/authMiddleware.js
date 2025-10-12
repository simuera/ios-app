"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../lib/jwt");
const logger_1 = require("../lib/logger");
const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ error: 'Unauthorized' });
    const token = header.split(' ')[1];
    const decoded = (0, jwt_1.verifyToken)(token);
    if (!decoded) {
        logger_1.logger.warn('Invalid token', { requestId: req.id });
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = { sub: decoded.sub ?? decoded.id, email: decoded.email, role: decoded.role };
    next();
};
exports.authMiddleware = authMiddleware;
