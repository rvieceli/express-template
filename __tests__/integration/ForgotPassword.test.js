import request from 'supertest';

import uuid from 'uuid';
import app from '../../src/app';
import factory from '../factories';
import User from '../../src/app/models/User';

import truncate from '../util/truncate';

const endpoint = 'https://www.frontend.com/forgot-password/:token/reset';

jest.mock('bull');

describe('Forgot Password', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to request password recovery', async done => {
    const user = await factory.create('ActiveUser');

    const response = await request(app)
      .post(`/forgot-password`)
      .send({
        email: user.email,
        endpoint,
      });

    expect(response.status).toBe(200);

    const { resetPasswordToken } = await User.findByPk(user.id);

    expect(resetPasswordToken).not.toBeNull();

    done();
  });

  it('should be validate empty or invalid email on password recovery request', async done => {
    const response = await request(app)
      .post(`/forgot-password`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('detail');

    done();
  });

  it('should be return ok if email does not exist', async done => {
    const response = await request(app)
      .post(`/forgot-password`)
      .send({
        email: 'a________aaaa@aaaa.zz',
        endpoint,
      });

    expect(response.status).toBe(200);
    done();
  });

  it('should be not abre to request for non activated accounts', async done => {
    const user = await factory.create('User');

    const response = await request(app)
      .post(`/forgot-password`)
      .send({
        email: user.email,
        endpoint,
      });

    expect(response.status).toBe(400);
    expect(response.body.error.name).toBe('UserActivationError');

    done();
  });

  it('should be not to reset with invalid token', async done => {
    const user = await factory.create('ActiveUser');

    await user.generateForgotPasswordToken();

    const response = await request(app)
      .put(`/forgot-password/${uuid.v4()}`)
      .send({
        email: user.email,
        password: '123456',
        confirmPassword: '123456',
      });

    expect(response.status).toBe(400);
    done();
  });

  it('should be not to reset with invalid body', async done => {
    const user = await factory.create('ActiveUser');

    await user.generateForgotPasswordToken();

    const response = await request(app)
      .put(`/forgot-password/${user.resetPasswordToken}`)
      .send({
        email: 'notanemail.com',
        password: '123456',
        confirmPassword: '654321',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('detail');
    done();
  });

  it('should be not to reset with past date token', async done => {
    const user = await factory.create('ActiveUser');

    await user.generateForgotPasswordToken();

    /** force to expires now */
    await user.update({
      resetPasswordExpires: new Date(),
    });

    const response = await request(app)
      .put(`/forgot-password/${user.resetPasswordToken}`)
      .send({
        email: user.email,
        password: '123456',
        confirmPassword: '123456',
      });

    expect(response.status).toBe(400);
    done();
  });

  it('should be able to reset password', async done => {
    const user = await factory.create('ActiveUser');

    await user.generateForgotPasswordToken();

    const response = await request(app)
      .put(`/forgot-password/${user.resetPasswordToken}`)
      .send({
        email: user.email,
        password: '123456',
        confirmPassword: '123456',
      });

    expect(response.status).toBe(200);

    await user.reload();

    const checkPassword = await user.checkPassword('123456');

    expect(checkPassword).toBeTruthy();

    done();
  });
});
