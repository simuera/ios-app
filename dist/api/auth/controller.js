"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service = __importStar(require("./service"));
const respond_1 = require("../../utils/respond");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const out = await service.registerUser(req.body);
        return (0, respond_1.success)(res, out, 201);
    }
    catch (err) {
        return (0, respond_1.fail)(res, { message: err.message || 'error' }, err.statusCode || 500);
    }
});
router.post('/login', async (req, res) => {
    try {
        const out = await service.loginUser({ ...req.body, userAgent: req.headers['user-agent'], ip: req.ip });
        return (0, respond_1.success)(res, out);
    }
    catch (err) {
        return (0, respond_1.fail)(res, { message: err.message || 'error' }, err.statusCode || 500);
    }
});
exports.default = router;
