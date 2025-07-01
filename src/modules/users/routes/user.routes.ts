import { Router } from "express";
import { celebrate, Joi, Segments } from 'celebrate';
import UserController from "../controllers/UserController";
import isAuthenticated from "@shared/middlewares/isAuthenticated";
import addressSchema from "../utils/addressSchema";

const userRouter = Router();
const userController = new UserController();

userRouter.get(
    '/',
    celebrate({
        [Segments.QUERY]: {
            page: Joi.number().integer().min(1).optional(),
            perPage: Joi.number().integer().min(1).max(100).optional(),
            name: Joi.string().optional(),
            lastName: Joi.string().optional(),
            email: Joi.string().email().optional(),
            role: Joi.string().optional(),
        }
    }),
    isAuthenticated,
    userController.index
);

userRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    userController.show,
);

userRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            role: Joi.string().required(),
        }
    }),
    userController.create,
);

userRouter.put(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            name: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            role: Joi.string().required(),
            addresses: Joi.array().items(addressSchema),
        }
    }),
    isAuthenticated,
    userController.update,
);

userRouter.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    userController.delete,
);

export default userRouter;
