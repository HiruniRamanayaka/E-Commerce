import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { checkJwt } from "../middleware/authMiddleware.js";
import { validateOrder } from "../middleware/validateMiddleware.js";
import { checkOrderOwner } from "../middleware/checkOwner.js";

const router = express.Router();

// POST /api/orders → create new order
router.post("/", checkJwt, validateOrder, async (req, res) => {
  try {
    const auth0Id = req.auth.sub;

    // Re-fetch product details from DB to prevent tampering
    const items = await Promise.all(
      req.body.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Invalid product ID: ${item.productId}`);
        if (typeof item.quantity !== "number" || item.quantity <= 0) {
          throw new Error(`Invalid quantity for product ${item.productId}`);
        }
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      owner: auth0Id,
      items,
      total,
      contact: req.body.contact,
      delivery: req.body.delivery,
      status: "pending",
      paymentStatus: "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(400).json({ message: err.message });
  }
});

// Get orders for logged-in user
router.get("/", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const orders = await Order.find({ owner: auth0Id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/:id → get single order (must be owner)
router.get("/:id", checkJwt, checkOrderOwner, async (req, res) => {
  res.json(req.order); // checkOrderOwner already attaches it
});

// PUT /api/orders/:id → update order status (admin use)
router.put("/:id", checkJwt, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // For now, only status update allowed
    order.status = req.body.status || order.status;
    const updated = await order.save();

    res.json(updated);
  } catch (err) {
    console.error("Order update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/orders/:id → delete order (only if owner)
router.delete("/:id", checkJwt, checkOrderOwner, async (req, res) => {
  try {
    await req.order.deleteOne();
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
