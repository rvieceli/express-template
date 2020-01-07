import { Router } from 'express';

import UserController from './app/controllers/User/Controller';
import ActivationController from './app/controllers/User/ActivationController';
import SessionController from './app/controllers/User/SessionController';

import userStoreValidator from './app/validators/userStoreValidator';
import sessionStoreValidator from './app/validators/sessionStoreValidator';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Welcome to your api' }));

routes.post('/users', userStoreValidator, UserController.store);
routes.post('/users/:token/activation', ActivationController.store);
routes.post('/sessions', sessionStoreValidator, SessionController.store);

export default routes;
