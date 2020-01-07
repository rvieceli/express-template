import ApplicationError from './ApplicationError';

class ValidationError extends ApplicationError {
  constructor(message, detail) {
    super(message, 400, detail);
  }
}

export default ValidationError;
