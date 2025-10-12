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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../lib/jwt");
const repo = __importStar(require("./repo"));
const logger_1 = require("../../lib/logger");
async function registerUser(payload) {
    const existing = await repo.findUserByEmail(payload.email);
    if (existing)
        throw { statusCode: 409, message: 'Email already in use' };
    const hash = await bcryptjs_1.default.hash(payload.password, 12);
    const user = await repo.createUser({ email: payload.email, passwordHash: hash, name: payload.name });
    logger_1.logger.info('User registered', { userId: user.id });
    await repo.createAudit({ action: 'user.register', userId: user.id });
    return { id: user.id, email: user.email, name: user.name };
}
async function loginUser(payload) {
    const user = await repo.findUserByEmail(payload.email);
    if (!user)
        throw { statusCode: 401, message: 'Invalid credentials' };
    const ok = await bcryptjs_1.default.compare(payload.password, user.passwordHash);
    if (!ok)
        throw { statusCode: 401, message: 'Invalid credentials' };
    await repo.createSession({ userId: user.id, userAgent: payload.userAgent, ip: payload.ip });
    const token = (0, jwt_1.signToken)({ sub: user.id, email: user.email, role: user.role });
    await repo.createAudit({ action: 'user.login', userId: user.id });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
}
