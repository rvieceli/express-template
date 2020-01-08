import bcrypt from 'bcryptjs';

import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);
    const checkPassword = await user.checkPassword('123456');

    expect(compareHash).toBe(true);
    expect(checkPassword).toBe(true);
  });
});
