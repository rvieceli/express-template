import request from 'supertest';

import uuid from 'uuid';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';
import User from '../../src/app/models/User';

describe('UserActivation', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async done => {
    done();
  });

  it('should be able to active account', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post(`/users/${user.externalId}/activation`)
      .send();

    expect(response.status).toBe(200);

    const { active, externalId } = await User.findByPk(user.id);

    expect(active).toBe(true);
    expect(externalId).not.toBe(user.externalId);
  });

  it('should be return exception if receive invalid uuid token', async () => {
    const response = await request(app)
      .post(`/users/same_token/activation`)
      .send();

    expect(response.status).toBe(400);
  });

  it('should be return exception if receive invalid token', async () => {
    const response = await request(app)
      .post(`/users/${uuid.v4()}/activation`)
      .send();

    expect(response.status).toBe(400);
  });
});
