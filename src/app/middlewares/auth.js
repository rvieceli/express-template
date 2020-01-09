import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../../lib/errors';
import authConfig from '../../config/auth';

import User from '../models/User';

export default async (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new UnauthorizedError('Token not provided');
  }

  const [, token] = authorization.split(' ');

  try {
    const { id } = await jwt.verify(token, authConfig.secret);
    const user = await User.findByExternalId(id);

    if (!user) {
      throw new UnauthorizedError();
    }

    request.user = user;

    next();
  } catch (err) {
    throw new UnauthorizedError('Token provided is invalid');
  }
};
