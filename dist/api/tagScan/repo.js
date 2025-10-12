"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByCode = exports.updateStatus = exports.createTagScan = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const createTagScan = (data) => prisma_1.default.tagScan.create({ data: { code: data.code, payload: data.payload } });
exports.createTagScan = createTagScan;
const updateStatus = (id, status) => prisma_1.default.tagScan.update({ where: { id }, data: { status } });
exports.updateStatus = updateStatus;
const findByCode = (code) => prisma_1.default.tagScan.findUnique({ where: { code } });
exports.findByCode = findByCode;
