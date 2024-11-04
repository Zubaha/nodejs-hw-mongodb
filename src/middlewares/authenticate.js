import createHttpError from 'http-errors';

import userSchema from '../models/user.js';
import sessionSchema from '../models/session.js';

export async function authenticate(req, res, next) {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'Please provide access token'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Please provide access token'));
  }

  const session = await sessionSchema.findOne({ accessToken });

  if (session === null) {
    return next(createHttpError(401, 'Session not found successfully'));
  }

  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token is expired'));
  }

  const user = await userSchema.findById(session.userId);

  if (user === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  req.user = { id: user._id, name: user.name };

  next();
}