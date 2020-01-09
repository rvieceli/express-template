import { Router } from 'express';

import UserController from '../app/controllers/User/Controller';
import ActivationController from '../app/controllers/User/ActivationController';
import SessionController from '../app/controllers/User/SessionController';
import ForgotPasswordController from '../app/controllers/User/ForgotPasswordController';

import userStoreValidator from '../app/validators/userStoreValidator';
import sessionStoreValidator from '../app/validators/sessionStoreValidator';
import forgotPasswordValidator from '../app/validators/forgotPasswordValidator';
import resetPasswordValidator from '../app/validators/resetPasswordValidator';
import tokenValidation from '../app/middlewares/params/tokenValidation';

import auth from '../app/middlewares/auth';

const routes = new Router();

routes.param('token', tokenValidation);

routes.get('/', (req, res) => res.json({ message: 'Welcome to your api' }));

routes.post('/users', userStoreValidator, UserController.store);
routes.get('/activation/resend', ActivationController.index);
routes.post('/activation/:token/confirm', ActivationController.store);
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

routes.get('/status', auth, (request, response) => response.json({ ok: true }));

export default routes;
