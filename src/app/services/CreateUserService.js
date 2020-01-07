import User from '../models/User';
import Queue from '../../lib/Queue';
import AccountConfirmationMail from '../jobs/AccountConfirmationMail';
import { ValidationError } from '../../lib/errors';

class CreateUserService {
  async run({ email, name, password, endpoint }) {
    const exist = await User.findByEmail(email);

    if (exist) {
      throw new ValidationError('User already exists');
    }

    const user = await User.create({ email, name, password });

    Queue.add(AccountConfirmationMail.key, {
      user,
      link: endpoint.replace(':token', user.externalId),
    });

    return user;
  }
}

export default new CreateUserService();
