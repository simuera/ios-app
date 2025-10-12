"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.success = void 0;
const success = (res, data, status = 200) => res.status(status).json({ status: 'ok', data });
exports.success = success;
const fail = (res, error, status = 400) => res.status(status).json({ status: 'fail', error });
exports.fail = fail;
