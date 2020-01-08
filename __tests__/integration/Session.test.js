import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });
  afterAll(async done => {
    done();
  });

  it('should be validade body params', async () => {
    const responseWithEmptyBody = await request(app)
      .post(`/sessions`)
      .send();

    expect(responseWithEmptyBody.status).toBe(400);
    expect(responseWithEmptyBody.body).toHaveProperty('detail');

    const responseWithInvalidEmailFormat = await request(app)
      .post(`/sessions`)
      .send({
        email: 'email.com.br',
        password: '123456',
      });

    expect(responseWithInvalidEmailFormat.status).toBe(400);
    expect(responseWithInvalidEmailFormat.body).toHaveProperty('detail');
  });

  it('should be able to can authenticate with active account', async () => {
    const user = await factory.create('ActiveUser', { password: '123456' });

    const response = await request(app)
      .post(`/sessions`)
      .send({
        email: user.email,
        password: '123456',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should be not able to can authenticate with inactive account', async () => {
    const user = await factory.create('User', { password: '123456' });

    const response = await request(app)
      .post(`/sessions`)
      .send({
        email: user.email,
        password: '123456',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.name).toBe('UserActivationError');
  });

  it('should be able to can authenticate with invalid credentials and return same error', async () => {
    const user = await factory.create('ActiveUser', { password: '123456' });

    const wrongEmailResponse = await request(app)
      .post(`/sessions`)
      .send({
        email: user.email,
        password: 'abcedf',
      });

    const wrongUserResponse = await request(app)
      .post(`/sessions`)
      .send({
        email: `a9_a9_a9_a9_a9_${user.email}.zzzz`,
        password: 'abcedf',
      });

    expect(wrongEmailResponse.status).toBe(wrongUserResponse.status);
    expect(wrongEmailResponse.body.error).toStrictEqual(
      wrongUserResponse.body.error
    );
  });
});
