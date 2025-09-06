import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^\d{10,15}$/).optional(),
  address: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
});