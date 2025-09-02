import express from "express";
import Order from "../models/Order.js";
import { checkJwt } from "../middleware/authMiddleware.js";
import { validateOrder } from "../middleware/validateMiddleware.js";

const router = express.Router();

// POST /api/orders → create new order
router.post("/", checkJwt, validateOrder, async (req, res) => {
  // console.log("Received order:", req.body);  // 🔹 log incoming request
  try {
    const total = req.body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      ...req.body,
      owner: req.auth.sub, // store user id from token
      total,
    });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get orders for logged-in user
router.get("/orders", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const orders = await Order.find({ owner: auth0Id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
