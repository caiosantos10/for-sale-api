import { Router } from "express";
import { celebrate, Joi, Segments } from 'celebrate';
import { ForgotPasswordController } from "../controllers/ForgotPasswordController";
import { ResetPasswordController } from "../controllers/ResetPasswordController";

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
    '/forgot',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        }
    }),
    forgotPasswordController.create,
);
passwordRouter.post(
    '/reset',
    celebrate({
        [Segments.BODY]: {
            password: Joi.string().required(),
            token: Joi.string().uuid().required(),
            password_confirmation: Joi.string().required().valid(Joi.ref('password')),
        }
    }),
    resetPasswordController.create,
);

export default passwordRouter;