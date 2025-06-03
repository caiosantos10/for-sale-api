import Joi from "joi";

const paymentMethodSchema = Joi.object({
    method: Joi.string().required(),
    installments: Joi.number().required(),
    cardBrand: Joi.string().required(),
});

export default paymentMethodSchema;