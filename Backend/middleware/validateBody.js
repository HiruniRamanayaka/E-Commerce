import { sanitizeRequest } from "./sanitizeMiddleware.js";

export const validateBody = (schema) => {
  return (req, res, next) => {

    // sanitize first
    sanitizeRequest(req, res, () => {});

    // then validate
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false, 
      stripUnknown: true, // remove extra fields
    });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }
    req.validatedBody = value;  // safe, validated body
    next();
  };
};