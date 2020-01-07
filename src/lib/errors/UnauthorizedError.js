import ApplicationError from './ApplicationError';

class UnauthorizedError extends ApplicationError {
  constructor(message) {
    super(message, 401);
  }
}

export default UnauthorizedError;
