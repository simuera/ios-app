import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? (req.route.path as string) : req.path, status: res.statusCode });
  });
  next();
};
export const metricsHandler = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
};
