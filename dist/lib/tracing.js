"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdk = void 0;
const sdk_node_1 = require("@opentelemetry/sdk-node");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const logger_1 = require("./logger");
const collector = process.env.OTEL_COLLECTOR_URL || '';
let sdk = null;
exports.sdk = sdk;
if (collector) {
    const exporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({ url: collector });
    exports.sdk = sdk = new sdk_node_1.NodeSDK({
        traceExporter: exporter,
    });
    (async () => {
        try {
            await sdk?.start();
            logger_1.logger.info('OTel started');
        }
        catch (e) {
            logger_1.logger.error('OTel failed', { error: e });
        }
    })();
}
else {
    logger_1.logger.info('OTEL_COLLECTOR_URL not set — tracing disabled');
}
