import Joi from "joi";

const addressSchema = Joi.object({
    street: Joi.string().required(),
    number: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip_code: Joi.string().pattern(/^\d{5}-\d{3}$/).required(),
});

export default addressSchema;