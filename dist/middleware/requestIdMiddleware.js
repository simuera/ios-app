"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = void 0;
const nanoid_1 = require("nanoid");
const requestIdMiddleware = (req, res, next) => {
    const id = req.headers['x-request-id'] || (0, nanoid_1.nanoid)(12);
    req.id = id;
    res.setHeader('X-Request-Id', id);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
