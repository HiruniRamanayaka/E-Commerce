import express from "express";
import Order from "../models/Order.js";
import { validateOrder } from "../middleware/validateMiddleware.js";

const router = express.Router();

// POST /api/orders → create new order
router.post("/", validateOrder, async (req, res) => {
    console.log("Received order:", req.body);  // 🔹 log incoming request
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
