import request from 'supertest';

import app from '../../../src/app';
import factory from '../../factories';
import truncate from '../../util/truncate';

const endpoint = 'https://www.frontend.com/confirmation/:token/account';

jest.mock('bull');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be validate body attributes', async done => {
    const response = await request(app)
      .post('/users')
      .send(/** empty */);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('detail');

    done();
  });

  it('should be able to register', async done => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({ ...user, endpoint });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');

    done();
  });

  it('should not be able to register with duplicated email', async done => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send({ ...user, endpoint });

    const response = await request(app)
      .post('/users')
      .send({ ...user, endpoint });

    expect(response.status).toBe(400);

    done();
  });
});
