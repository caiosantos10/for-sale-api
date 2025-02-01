import { Router, Request, Response } from 'express';
import productRouter from 'src/modules/products/routes/product.routes';

const routes = Router();

routes.use('/products', productRouter);

export default routes;