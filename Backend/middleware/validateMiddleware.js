// ... Validate Order ...

export const validateOrder = (req, res, next) => {
  const { items, contact, delivery } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must have at least one item." });
  }

  // validate item or quantity
  for (const item of items) {
    if (!item.productId || item.quantity <= 0) {
      return res.status(400).json({ message: "Invalid item or quantity." });
    }
  }

  // validate contact info
  if (!contact?.name || !contact?.address || !contact?.phone || !contact?.district) {
    return res.status(400).json({ message: "Contact info is required." });
  }

  // Validate phone format (10–15 digits)
  if (!/^\d{10,15}$/.test(contact.phone)) {
    return res.status(400).json({ message: "Phone number must be 10–15 digits." });
  }

  // validate deivery date
  const deliveryDate = new Date(delivery?.date);
  const today = new Date();
  deliveryDate.setHours(0, 0, 0, 0);

  if (!delivery?.paymentMethod || deliveryDate < today) {
    return res.status(400).json({ message: "Delivery date must be today or in the future." });
  }

  // No Sundays
  if (deliveryDate.getDay() === 0) {
    return res.status(400).json({ message: "Delivery cannot be scheduled on Sundays." });
  }

   // Validate delivery time
  const allowedTimes = ["10 AM", "11 AM", "12 PM"];
  if (!delivery?.time || !allowedTimes.includes(delivery.time)) {
    return res.status(400).json({ message: "Invalid delivery time selected." });
  }

  // Validate payment method
  if (!delivery?.paymentMethod) {
    return res.status(400).json({ message: "Payment method is required." });
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

  next();
};
