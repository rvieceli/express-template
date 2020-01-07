import { ValidationError } from '../../../lib/errors';
import User from '../../models/User';

class ActivationController {
  async store(request, response) {
    const { token } = request.params;

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
