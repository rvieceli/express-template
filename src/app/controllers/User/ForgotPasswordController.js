import { isBefore } from 'date-fns';
import User from '../../models/User';
import { UserActivationError, ValidationError } from '../../../lib/errors';

import Queue from '../../../lib/Queue';
import ForgotPasswordMail from '../../jobs/ForgotPasswordMail';

class ForgotPasswordController {
  async store(request, response) {
    const { email, endpoint } = request.body;

    const user = await User.findByEmail(email);

    if (user && !user.active) {
      throw new UserActivationError();
    }

    if (user) {
      await user.generateForgotPasswordToken();

      Queue.add(ForgotPasswordMail.key, {
        user,
        link: endpoint.replace(':token', user.resetPasswordToken),
      });
    }

    return response.json({
      message: 'We send you email to reset your password.',
    });
  }

  async update(request, response) {
    const { token: resetPasswordToken } = request.params;
    const { email, password } = request.body;

    const user = await User.findByEmail(email);

    if (!user || user.resetPasswordToken !== resetPasswordToken) {
      throw new ValidationError('Reset token is invalid');
    }

    if (isBefore(user.resetPasswordExpires, new Date())) {
      throw new ValidationError('Token was expired');
    }

    await user.resetPassword(password);

    return response.json({ message: 'Password has been reseted' });
  }
}

export default new ForgotPasswordController();
