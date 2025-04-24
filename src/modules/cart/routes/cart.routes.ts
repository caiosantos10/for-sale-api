import { Router } from "express";
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from "@shared/middlewares/isAuthenticated";
import CartController from "../controllers/ CartController";

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
            productIds: Joi.array().required(),
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
            productIds: Joi.array().required(),
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
