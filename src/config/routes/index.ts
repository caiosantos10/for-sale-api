import { Router, Request, Response } from 'express';
import productRouter from 'src/modules/products/routes/product.routes';
import userRouter from 'src/modules/users/routes/user.routes';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);

export default routes;