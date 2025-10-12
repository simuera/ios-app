import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import * as Resources from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { logger } from './logger';
const collector = process.env.OTEL_COLLECTOR_URL || '';
let sdk: NodeSDK | null = null;
if (collector) {
  const exporter = new OTLPTraceExporter({ url: collector });
  sdk = new NodeSDK({
    traceExporter: exporter,
  });
  (async () => {
    try {
      await sdk?.start();
      logger.info('OTel started');
    } catch (e: any) {
      logger.error('OTel failed', { error: e });
    }
  })();
} else {
  logger.info('OTEL_COLLECTOR_URL not set — tracing disabled');
}
export { sdk };
