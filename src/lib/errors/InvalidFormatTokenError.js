import ApplicationError from './ApplicationError';

class InvalidFormatTokenError extends ApplicationError {
  constructor(message = 'Token is invalid') {
    super(message, 400);
  }
}

export default InvalidFormatTokenError;
