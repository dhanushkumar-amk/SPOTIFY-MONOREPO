// middleware/security.js

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import useragent from 'express-useragent';

// ✅ Rate Limiter (e.g., 100 requests per 15 min per IP)
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Bot Detection Middleware
export const detectBot = (req, res, next) => {
  const ua = req.useragent;
  const botSignatures = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /curl/i,
    /wget/i,
    /python/i,
    /scrapy/i,
    /go-http-client/i,
  ];

  if (!ua || botSignatures.some(regex => regex.test(ua.source))) {
    console.warn(`Blocked suspected bot: ${ua?.source}`);
    return res.status(403).json({ success: false, message: 'Bot access denied' });
  }

  next();
};

// ✅ Common Security Headers Middleware
export const applySecurityHeaders = helmet();
