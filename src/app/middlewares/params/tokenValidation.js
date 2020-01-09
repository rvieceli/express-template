import { InvalidFormatTokenError } from '../../../lib/errors';

const regexUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default (request, response, next, token) => {
  if (!regexUuid.test(token))
    throw new InvalidFormatTokenError('Token is invalid');
  next();
};
