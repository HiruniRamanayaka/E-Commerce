import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().trim().required(),
  stock: Joi.number().integer().min(0).required(),
  imageUrl: Joi.string().uri().required(),
  category: Joi.string().trim().optional(),
  brand: Joi.string().trim().optional(),
});