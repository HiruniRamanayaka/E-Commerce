import Joi from "joi";

export const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().hex().length(24).required(),
      quantity: Joi.number().integer().min(1).max(100).required(),
    })
  ).min(1).required(),

  total: Joi.number().min(0).required(),

  contact: Joi.object({
    name: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    district: Joi.string().trim().required(),
  }).required(),

  delivery: Joi.object({
    date: Joi.date().min("now").required(),
    time: Joi.string().valid("10 AM", "11 AM", "12 PM").required(),
    paymentMethod: Joi.string().valid("Cash", "Card").required(),
    message: Joi.string().trim().max(300).allow("").optional(),
  }).required(),

  status: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").optional(),
  paymentStatus: Joi.string().valid("pending", "paid", "failed").optional(),
  transactionId: Joi.string().optional(),
});