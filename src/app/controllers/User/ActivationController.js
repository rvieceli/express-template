import { ValidationError } from '../../../lib/errors';
import User from '../../models/User';

const regexUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class ActivationController {
  async store(request, response) {
    const { token } = request.params;

    if (!regexUuid.test(token)) {
      throw new ValidationError('Token is invalid');
    }

    const user = await User.findByExternalId(token);

    if (!user) {
      throw new ValidationError('Toker is not found or already been activated');
    }

    await user.activate();

    return response.json({
      message: 'Your account has been activated successfully',
    });
  }
}

export default new ActivationController();
