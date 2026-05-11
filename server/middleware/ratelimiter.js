const ratelimit = require('express-rate-limit');

const RateLimiter = ratelimit({
  windowMs: 15*60*1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 48,
  message: 'Too many reqs made try later'
});

const AuthRateLimiter = ratelimit({
  windowMs: 10*60*1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 60,
  message: 'Too many Authentication atempts'
});

module.exports = { RateLimiter, AuthRateLimiter };