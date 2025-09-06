import Joi from "joi";

export const initiatePaymentSchema = Joi.object({
  orderId: Joi.string().hex().length(24).required(),
});

export const confirmPaymentSchema = Joi.object({
  orderId: Joi.string().hex().length(24).required(),
  transactionId: Joi.string().trim().min(1).required(),
});