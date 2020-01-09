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

  it('should be remove sinsible data from user', async () => {
    const user = await factory.create('User');

    const jsonUser = JSON.parse(JSON.stringify(user));

    expect(jsonUser).not.toHaveProperty('password');
    expect(jsonUser).not.toHaveProperty('password_hash');
    expect(jsonUser).not.toHaveProperty('active');
    expect(jsonUser).not.toHaveProperty('resetPasswordToken');
    expect(jsonUser).not.toHaveProperty('resetPasswordExpires');
    expect(jsonUser).not.toHaveProperty('createdAt');
    expect(jsonUser).not.toHaveProperty('updatedAt');
    expect(jsonUser).not.toHaveProperty('externalId');
    expect(jsonUser.id).toBe(user.externalId);
  });
});
