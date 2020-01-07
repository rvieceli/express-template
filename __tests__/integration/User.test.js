import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

// visto em
// https://github.com/stipsan/ioredis-mock/issues/568
jest.mock('ioredis', () => {
  // eslint-disable-next-line global-require
  const Redis = require('ioredis-mock');
  if (typeof Redis === 'object') {
    // the first mock is an ioredis shim because ioredis-mock depends on it
    // https://github.com/stipsan/ioredis-mock/blob/master/src/index.js#L101-L111
    return {
      Command: { _transformer: { argument: {}, reply: {} } },
    };
  }
  // second mock for our code
  return function(...args) {
    return new Redis(args);
  };
});

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be validate body attributes', async () => {
    const response = await request(app)
      .post('/users')
      .send(/** empty */);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('detail');
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });
});
