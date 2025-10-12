"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAudit = exports.createSession = exports.createUser = exports.findUserByEmail = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const findUserByEmail = (email) => prisma_1.default.user.findUnique({ where: { email } });
exports.findUserByEmail = findUserByEmail;
const createUser = (data) => prisma_1.default.user.create({ data });
exports.createUser = createUser;
const createSession = (data) => prisma_1.default.session.create({ data });
exports.createSession = createSession;
const createAudit = (data) => prisma_1.default.auditLog.create({ data });
exports.createAudit = createAudit;
