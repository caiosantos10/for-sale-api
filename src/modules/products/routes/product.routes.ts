import { Router } from "express";
import ProductController from "../controllers/ProductController";
import { celebrate, Joi, Segments } from 'celebrate';
import multer from "multer";
import isAuthenticated from "@shared/errors/middlewares/isAuthenticated";
import ProductImageController from "../controllers/ProductImageController";
import uploadConfig from "@config/upload";

const productRouter = Router();
const productController = new ProductController();
const productImageController = new ProductImageController();

const upload = multer(uploadConfig);

productRouter.get('/', isAuthenticated, productController.index);

productRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
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
    isAuthenticated,
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
    isAuthenticated,
    productController.update,
);

productRouter.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    productController.delete,
);

productRouter.patch(
    '/image/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        }
    }),
    isAuthenticated,
    upload.single('image'),
    productImageController.update
)

export default productRouter;
