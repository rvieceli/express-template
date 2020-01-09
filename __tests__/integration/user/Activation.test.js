import request from 'supertest';

import uuid from 'uuid';
import app from '../../../src/app';
import factory from '../../factories';
import truncate from '../../util/truncate';
import User from '../../../src/app/models/User';

const endpoint = 'https://www.frontend.com/confirmation/:token/account';

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
      .post(`/activation/${user.externalId}/confirm`)
      .send();

    expect(response.status).toBe(200);

    const { active, externalId } = await User.findByPk(user.id);

    expect(active).toBe(true);
    expect(externalId).not.toBe(user.externalId);
  });

  it('should be return exception if receive invalid uuid token', async () => {
    const response = await request(app)
      .post(`/activation/same_token/confirm`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.error.name).toBe('InvalidFormatTokenError');
  });

  it('should be return exception if receive invalid token', async () => {
    const response = await request(app)
      .post(`/activation/${uuid.v4()}/confirm`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.error.name).toBe('ValidationError');
  });

  it('should be able resend activatio email', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get(`/activation/resend`)
      .send({
        email: user.email,
        endpoint,
      });

    expect(response.status).toBe(200);
  });

  it('should be not able resend activatio email to active account', async () => {
    const user = await factory.create('ActiveUser');

    const response = await request(app)
      .get(`/activation/resend`)
      .send({
        email: user.email,
        endpoint,
      });

    expect(response.status).toBe(400);
    expect(response.body.error.name).toBe('ValidationError');
  });
});
