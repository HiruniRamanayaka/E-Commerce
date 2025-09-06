// ... Validate Order ...

import sanitizeHtml from "sanitize-html";

export const validateOrder = (req, res, next) => {
  const { items, contact, delivery } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must have at least one item." });
  }

  // validate item or quantity
  for (const item of items) {
    if (typeof item.quantity !== "number" || item.quantity < 0 || item.quantity > 100) {
      return res.status(400).json({ message: "Invalid item or quantity. Item quantity must be between 1 and 100." });
    }
  }

  // validate contact info
  if (!contact || !contact.name || !contact.address || !contact.phone || !contact.district) {
    return res.status(400).json({ message: "Contact info is required." });
  }

  // Validate phone format (10–15 digits)
  if (contact.phone && !/^\d{10,15}$/.test(contact.phone)) {
    return res.status(400).json({ message: "Phone number must be 10–15 digits." });
  }

  // delivery present?
  if (!delivery) {
    return res.status(400).json({ message: "Delivery info required." });
  }

  // validate deivery date
  const deliveryDate = new Date(delivery.date);
  if (isNaN(deliveryDate.getTime())) {
    return res.status(400).json({ message: "Invalid delivery date." });
  }


  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deliveryDate.setHours(0, 0, 0, 0);

  if (!delivery?.paymentMethod || deliveryDate < today) {
    return res.status(400).json({ message: "Delivery date must be today or in the future and payment method required." });
  }

  // No Sundays
  if (deliveryDate.getDay() === 0) {
    return res.status(400).json({ message: "Delivery cannot be scheduled on Sundays." });
  }

   // Validate delivery time
  const allowedTimes = ["10 AM", "11 AM", "12 PM"];
  if (!delivery.time || !allowedTimes.includes(delivery.time)) {
    return res.status(400).json({ message: "Invalid delivery time selected." });
  }

  // Validate payment method
  if (!delivery.paymentMethod || typeof delivery.paymentMethod !== "string") {
    return res.status(400).json({ message: "Payment method is required." });
  }

  // ... inside validateOrder after checking delivery.message
  if (delivery?.message) {
    req.body.delivery.message = sanitizeHtml(delivery.message, {
      allowedTags: [], // no HTML tags allowed
      allowedAttributes: {},
      textFilter: (text) => text.trim(),
    });
  }

  if (delivery.message) {
  if (typeof delivery.message !== "string") {
    return res.status(400).json({ message: "Delivery message must be a string." });
  }

  const trimmed = delivery.message.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ message: "Delivery message cannot be empty." });
  }

  if (trimmed.length > 300) {
    return res.status(400).json({ message: "Delivery message must be under 300 characters." });
  }
}

  next();
};


// ... Validate Profile ...
export const validateProfile = (req, res, next) => {
  const { name, phone, address, country } = req.body;

  // Name is required
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ message: "Name is required." });
  }

  // Phone optional but must be valid format if provided
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ message: "Phone number is required and it must be 10-15 digits." });
  }

  // Address optional, but max length
  if (!address || typeof address !== "string" || address.trim().length === 0) {
    return res.status(400).json({ message: "Address is required" });
  }
  
  // 
  if (!country || typeof country !== "string" || country.trim().length === 0) {
    return res.status(400).json({ message: "Country is required." });
  }

  // Sanitize text inputs
  req.body.name = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {}, textFilter: (text) => text.trim(), });
  req.body.address = sanitizeHtml(address, { allowedTags: [], allowedAttributes: {}, textFilter: (text) => text.trim(), });
  req.body.country = sanitizeHtml(country, { allowedTags: [], allowedAttributes: {}, textFilter: (text) => text.trim(), });


  next();
};
