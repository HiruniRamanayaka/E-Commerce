import Joi from "joi";

export const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .hex()
          .length(24)
          .required()
          .messages({
            "string.hex": "Product ID must be a valid hex string",
            "string.length": "Product ID must be 24 characters",
          }),
        quantity: Joi.number()
          .integer()
          .min(1)
          .max(100)
          .required()
          .messages({
            "number.base": "Quantity must be a number",
            "number.min": "Minimum quantity is 1",
            "number.max": "Maximum quantity is 100",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one item is required in the order",
    }),

  total: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Total must be a number",
      "number.min": "Total cannot be negative",
    }),

  contact: Joi.object({
    name: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z\s'-]{2,50}$/)
      .required()
      .messages({
        "string.pattern.base": "Name must contain only letters and valid characters",
        "string.empty": "Name is required",
      }),

    address: Joi.string()
      .trim()
      .max(200)
      .required()
      .messages({
        "string.max": "Address must be under 200 characters",
        "string.empty": "Address is required",
      }),

    phone: Joi.string()
      .pattern(/^\d{10,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be 10–15 digits",
        "string.empty": "Phone number is required",
      }),

    district: Joi.string()
      .trim()
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base": "District must contain only letters and spaces",
        "string.empty": "District is required",
      }),
  }).required(),

  delivery: Joi.object({
    date: Joi.date()
      .min("now")
      .required()
      .messages({
        "date.min": "Delivery date must be today or in the future",
        "date.base": "Invalid delivery date format",
      }),

    time: Joi.string()
      .valid("10 AM", "11 AM", "12 PM")
      .required()
      .messages({
        "any.only": "Delivery time must be one of: 10 AM, 11 AM, 12 PM",
        "string.empty": "Delivery time is required",
      }),

    paymentMethod: Joi.string()
      .valid("Cash", "Card")
      .required()
      .messages({
        "any.only": "Payment method must be either Cash or Card",
        "string.empty": "Payment method is required",
      }),

    message: Joi.string()
      .trim()
      .max(300)
      .allow("")
      .optional()
      .messages({
        "string.max": "Message must be under 300 characters",
      }),
  }).required(),

  status: Joi.string()
    .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
    .optional()
    .messages({
      "any.only": "Invalid order status",
    }),

  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed")
    .optional()
    .messages({
      "any.only": "Invalid payment status",
    }),

  transactionId: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      "string.max": "Transaction ID must be under 100 characters",
    }),
});