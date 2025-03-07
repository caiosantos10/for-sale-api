import passwordRouter from '@modules/users/routes/password.routes';
import { Router } from 'express';
import sessionsRouter from 'src/modules/auth/routes/session.routes';
import productRouter from 'src/modules/products/routes/product.routes';
import userRouter from 'src/modules/users/routes/user.routes';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);

export default routes;