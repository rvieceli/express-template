import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';

factory.define('User', User, () => {
  const attrs = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return {
    ...attrs,
    confirmPassword: attrs.password,
  };
});

factory.extend('User', 'ActiveUser', null, {
  afterCreate: async model => {
    await model.activate();
    return model;
  },
});

export default factory;
