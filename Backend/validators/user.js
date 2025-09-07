import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z\s'-]{2,50}$/) // allows letters, spaces, apostrophes, hyphens
    .messages({
      "string.pattern.base": "Name must contain only letters and valid characters",
    })
    .optional(),

  email: Joi.string()
    .email()
    .messages({
      "string.email": "Please enter a valid email address",
    })
    .optional(),

  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .messages({
      "string.pattern.base": "Phone number must be between 10 and 15 digits",
    })
    .optional(),

  address: Joi.string()
    .trim()
    .max(200)
    .messages({
      "string.max": "Address must be under 200 characters",
    })
    .optional(),

  country: Joi.string()
    .trim()
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base": "Country must contain only letters and spaces",
    })
    .optional(),
});