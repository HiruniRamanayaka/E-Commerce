// Validate Order

export const validateOrder = (req, res, next) => {
  const { items, contact, delivery } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must have at least one item." });
  }

  for (const item of items) {
    if (!item.productId || item.quantity <= 0) {
      return res.status(400).json({ message: "Invalid item or quantity." });
    }
  }

  if (!contact?.name || !contact?.address || !contact?.phone || !contact?.district) {
    return res.status(400).json({ message: "Contact info is required." });
  }

  const deliveryDate = new Date(delivery?.date);
  if (!delivery?.paymentMethod || deliveryDate < new Date()) {
    return res.status(400).json({ message: "Invalid delivery date or payment method." });
  }

  next();
};


// Validate Profile
export const validateProfile = (req, res, next) => {
  const { name, phone, address, email } = req.body;

  // Name is required
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ message: "Name is required." });
  }

  // Phone optional but must be valid format if provided
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ message: "Phone number is required and it must be 10-15 digits." });
  }

  // Address optional, but max length
  if (!address || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ message: "Address is required" });
  }

  next();
};
