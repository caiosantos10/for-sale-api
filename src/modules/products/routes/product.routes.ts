import { Router } from "express";
import ProductController from "../controllers/ProductController";
import { celebrate, Joi, Segments } from 'celebrate';

const productRouter = Router();
const productController = new ProductController();

productRouter.get('/', productController.index);

productRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    productController.show,
);

productRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().precision(2).required(),
        }
    }),
    productController.create,
);

productRouter.put(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().precision(2).required(),
        }
    }),
    productController.update,
);

productRouter.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    productController.delete,
);

export default productRouter;
