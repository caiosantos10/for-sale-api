import { Router } from "express";
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from "@shared/errors/middlewares/isAuthenticated";
import ProfileController from "../controllers/ProfileController";

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.get('/', profileController.show);

profileRouter.put('/',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            old_password: Joi.string(),
            new_password: Joi.string().optional(),
            new_password_confirmation: Joi.string()
            .valid(Joi.ref('password'))
            .when('password', {
                is: Joi.exist(),
                then: Joi.required(),
                }
            ),
        }
    }),
    profileController.update,
);

export default profileRouter;
