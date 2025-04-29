import { Router } from "express";
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from "@shared/middlewares/isAuthenticated";
import CartController from "../controllers/ CartController";
import { ProductsRequestDTO } from "../utils/cart.dto";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    cartController.show,
);

cartRouter.get(
    '/by-user/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    cartController.findByUser,
);

cartRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            products: Joi.array<ProductsRequestDTO[]>().required(),
        }
    }),
    isAuthenticated,
    cartController.create,
);

cartRouter.put(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            products: Joi.array<ProductsRequestDTO[]>().required(),
        }
    }),
    isAuthenticated,
    cartController.update,
);

cartRouter.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    cartController.delete,
);

export default cartRouter;
