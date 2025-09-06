import mongoose from "mongoose";
import Order from "../models/Order.js";

export const checkOrderOwner = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.owner !== req.auth.sub) {
      return res.status(403).json({ message: "Forbidden: Not your order" });
    }
    req.order = order; // attach for later use
    next();
  } catch (err) {
    console.error("Owner check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
