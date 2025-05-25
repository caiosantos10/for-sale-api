import { Router } from "express";
import { celebrate, Joi, Segments } from 'celebrate';
import UserController from "../controllers/UserController";
import isAuthenticated from "@shared/middlewares/isAuthenticated";

const userRouter = Router();
const userController = new UserController();

const addressSchema = Joi.object({
    street: Joi.string().required(),
    number: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip_code: Joi.string().pattern(/^\d{5}-\d{3}$/).required(),
});

userRouter.get('/', isAuthenticated, userController.index);

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
