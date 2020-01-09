import { ValidationError } from '../../../lib/errors';
import User from '../../models/User';
import AccountConfirmationMail from '../../jobs/AccountConfirmationMail';
import Queue from '../../../lib/Queue';

class ActivationController {
  async index(request, response) {
    const { email, endpoint } = request.body;

    const user = await User.findByEmail(email);

    if (user) {
      if (user.active)
        throw new ValidationError('Your account has been ativated.');

      Queue.add(AccountConfirmationMail.key, {
        user,
        link: endpoint.replace(':token', user.externalId),
      });
    }

    return response.json({
      message: 'We resend you an email to confirmation account.',
    });
  }

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
