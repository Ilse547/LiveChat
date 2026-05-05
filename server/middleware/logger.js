const fs = require('fs');
const path = require('path');

const LogDir = path.join(__dirname, '../../logs');
if(!fs.existsSync(LogDir)) fs.mkdirSync(LogDir, { recursive: true });
const LogStream = fs.createWriteStream(path.join(LogDir, 'access.log'), { flags: 'a' });

function logger(req, res, next) {
  const ip =
    req.ip ||
    (req.connection && req.connection.remoteAddress) ||
    (req.socket && req.socket.remoteAddress) ||
    'unknown';

  const now = new Date().toUTCString();
  console.log(`[${now}] ${ip} ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const user = req.user?.username || 'guest';
    const entry = `[${now}] ${ip} ${req.method} ${req.originalUrl} ${res.statusCode} user:${user}\n`;
    process.stdout.write(entry);
    LogStream.write(entry);
  });

  next();
}

module.exports = { logger };