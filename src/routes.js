import { Router } from 'express';

import UserController from './app/controllers/User/Controller';
import ActivationController from './app/controllers/User/ActivationController';
import SessionController from './app/controllers/User/SessionController';
import ForgotPasswordController from './app/controllers/User/ForgotPasswordController';

import userStoreValidator from './app/validators/userStoreValidator';
import sessionStoreValidator from './app/validators/sessionStoreValidator';
import forgotPasswordValidator from './app/validators/forgotPasswordValidator';
import resetPasswordValidator from './app/validators/resetPasswordValidator';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Welcome to your api' }));

routes.post('/users', userStoreValidator, UserController.store);
routes.post('/users/:token/activation', ActivationController.store);
routes.post('/sessions', sessionStoreValidator, SessionController.store);
routes.post(
  '/forgot-password',
  forgotPasswordValidator,
  ForgotPasswordController.store
);
routes.put(
  '/forgot-password/:token',
  resetPasswordValidator,
  ForgotPasswordController.update
);

export default routes;
