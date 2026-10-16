import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { Request, Response, NextFunction } from 'express';

// In-memory token bucket / sliding window rate limiter: max 20 requests per second per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function rateLimiterAndSecurity(req: Request, res: Response, next: NextFunction) {
  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.removeHeader('X-Powered-By');

  // Rate Limiting: 20 req/s per client IP
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 1000; // 1 second window
  const limit = 20; // 20 requests per second

  const clientData = requestCounts.get(clientIp);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIp, { count: 1, resetTime: now + windowMs });
  } else {
    clientData.count++;
    if (clientData.count > limit) {
      res.setHeader('Retry-After', '1');
      res.status(429).json({
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded: maximum 20 requests per second allowed. Please try again in a moment.'
      });
      return;
    }
  }

  // Periodic cleanup of stale IPs every 60 seconds
  if (requestCounts.size > 10000) {
    for (const [ip, data] of requestCounts.entries()) {
      if (now > data.resetTime) {
        requestCounts.delete(ip);
      }
    }
  }

  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply Rate Limiting & Security Headers
  app.use(rateLimiterAndSecurity);

  app.enableCors({
    exposedHeaders: ['Content-Disposition', 'Content-Length']
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`API is running on http://localhost:${port} with security & 20 req/s rate limiting`);
}
await bootstrap();
