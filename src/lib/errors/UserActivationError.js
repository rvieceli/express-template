import ApplicationError from './ApplicationError';

class UserActivationError extends ApplicationError {
  constructor(message = 'User account is not active') {
    super(message, 400);
  }
}

export default UserActivationError;
