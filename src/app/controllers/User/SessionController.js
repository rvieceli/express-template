import User from '../../models/User';
import {
  UserActivationError,
  InvalidCredentialsError,
} from '../../../lib/errors';

class SessionController {
  async store(request, response) {
    const { email, password } = request.body;

    const user = await User.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!user.active) {
      throw new UserActivationError();
    }

    if (!(await user.checkPassword(password))) {
      throw new InvalidCredentialsError();
    }

    const token = user.generateToken();

    return response.json({
      user,
      token,
    });
  }
}

export default new SessionController();
