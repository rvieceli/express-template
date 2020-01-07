import ApplicationError from './ApplicationError';

class NotFoundError extends ApplicationError {
  constructor(message) {
    super(message, 404);
  }
}

export default NotFoundError;
