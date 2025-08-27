import { Router } from "express";
import MerchantController from "../controllers/MerchantController";
import { celebrate, Joi, Segments } from 'celebrate';
import multer from "multer";
import isAuthenticated from "@shared/middlewares/isAuthenticated";
import uploadConfig from "@config/upload";

const merchantRouter = Router();
const merchantController = new MerchantController();

const upload = multer(uploadConfig);

merchantRouter.get(
    '/',
    celebrate({
        [Segments.QUERY]: {
            page: Joi.number().integer().min(1).optional(),
            perPage: Joi.number().integer().min(1).max(100).optional(),
            legal_name: Joi.string().optional(),
        }
    }),
    isAuthenticated,
    merchantController.index
);

merchantRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    merchantController.show,
);

merchantRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            legal_name: Joi.string().trim().max(150).required(),
            trade_name: Joi.string().trim().max(150).required(),
            cnpj: Joi.string().trim().pattern(/^\d{14}$/).required(),
            contact_email: Joi.string().trim().email().max(150).optional(),
            phone: Joi.string().trim().min(8).max(20).optional(),
        }
    }),
    isAuthenticated,
    merchantController.create,
);

merchantRouter.put(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            legal_name: Joi.string().trim().max(150).required(),
            trade_name: Joi.string().trim().max(150).required(),
            cnpj: Joi.string().trim().pattern(/^\d{14}$/).required(),
            contact_email: Joi.string().trim().email().max(150).optional(),
            phone: Joi.string().trim().min(8).max(20).optional(),
        }
    }),
    isAuthenticated,
    merchantController.update,
);

merchantRouter.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    merchantController.delete,
);

export default merchantRouter;
