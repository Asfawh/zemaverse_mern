import dotenv from 'dotenv';
import { jwtVerify } from 'jose';

dotenv.config();

function getSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  return new TextEncoder().encode(process.env.JWT_SECRET);
}

function getBearerToken(req) {
  const authorization = req.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice(7).trim();
}

async function authenticate(req, res, next, required) {
  const token = getBearerToken(req);

  if (!token) {
    if (required) {
      return res.status(401).json({ message: 'Please log in to continue.' });
    }

    return next();
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    req.userId = payload.id;
    req.username = payload.username;
    return next();
  } catch {
    if (!required) {
      return next();
    }

    return res.status(401).json({ message: 'Your login has expired. Please log in again.' });
  }
}

function requireAuth(req, res, next) {
  return authenticate(req, res, next, true);
}

function optionalAuth(req, res, next) {
  return authenticate(req, res, next, false);
}

async function requireEditor(req, res, next) {
  await authenticate(req, res, async () => {
    const { default: User } = await import('../models/user-model.js');
    const user = await User.findById(req.userId).select({ username: 1 }).lean();
    if (user?.username !== 'cho') {
      return res.status(403).json({ message: 'Catalog editor access is required.' });
    }
    req.username = user.username;
    next();
  }, true);
}

export { optionalAuth, requireAuth, requireEditor };
