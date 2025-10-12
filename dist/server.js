"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./lib/logger");
require("./lib/tracing");
const prisma_1 = __importDefault(require("./lib/prisma"));
const port = Number(process.env.PORT || 3000);
async function connectWithRetry(maxAttempts = 8) {
    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            await prisma_1.default.$connect();
            logger_1.logger.info('Prisma connected');
            return;
        }
        catch (err) {
            attempt += 1;
            const wait = Math.min(30000, 2 ** attempt * 1000);
            logger_1.logger.warn('Prisma connection failed, retrying', { attempt, wait, error: err });
            await new Promise((res) => setTimeout(res, wait));
        }
    }
    throw new Error('Unable to connect to Prisma after retries');
}
async function start() {
    try {
        await connectWithRetry();
        app_1.default.listen(port, () => logger_1.logger.info(`Server listening on ${port}`));
    }
    catch (err) {
        logger_1.logger.error('Failed to start after retries', { error: err });
        process.exit(1);
    }
}
start();
