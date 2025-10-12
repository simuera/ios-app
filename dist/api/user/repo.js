"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.findById = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const findById = (id) => prisma_1.default.user.findUnique({ where: { id } });
exports.findById = findById;
const listUsers = (skip = 0, take = 50) => prisma_1.default.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
exports.listUsers = listUsers;
