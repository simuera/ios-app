"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const respond_1 = require("../../utils/respond");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        return (0, respond_1.success)(res, { status: 'ok' });
    }
    catch (e) {
        return res.status(503).json({ status: 'fail', error: 'db-unavailable' });
    }
});
exports.default = router;
