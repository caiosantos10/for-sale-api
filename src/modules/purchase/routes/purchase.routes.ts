import { Router } from "express";
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from "@shared/middlewares/isAuthenticated";
import PurchaseController from "../controllers/PurchaseController";
import addressSchema from "@modules/users/utils/addressSchema";

const purchaseRouter = Router();
const purchaseController = new PurchaseController();

purchaseRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    purchaseController.show,
);

purchaseRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            status: Joi.string().required(),
            delivery_address: addressSchema,
        }
    }),
    isAuthenticated,
    purchaseController.create,
);

purchaseRouter.put(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            status: Joi.string().required(),
        }
    }),
    isAuthenticated,
    purchaseController.update,
);

export default purchaseRouter;
