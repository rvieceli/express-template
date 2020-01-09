import { Router } from 'express';

import user from './user';

const routes = new Router();

routes.use(user);

export default routes;
