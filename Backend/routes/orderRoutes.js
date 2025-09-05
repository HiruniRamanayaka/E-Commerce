import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { checkJwt } from "../middleware/authMiddleware.js";
import { validateOrder } from "../middleware/validateMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { checkOrderOwner } from "../middleware/checkOwner.js";

const router = express.Router();

// POST /api/orders → create new order
router.post("/", checkJwt, checkRole(["user"]), validateOrder, async (req, res) => {
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
router.get("/", checkJwt, checkRole(["user"]), async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const orders = await Order.find({ owner: auth0Id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: get all orders
router.get("/all", checkJwt, checkRole(["admin"]), async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single order (owner or admin)
router.get("/:id", checkJwt, checkRole(["user", "admin"]), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const roles = req.auth[process.env.AUTH0_ROLES_NAMESPACE] || [];
    if (order.owner !== req.auth.sub && !roles.includes("admin"))
      return res.status(403).json({ message: "Access denied" });

    res.json(order);
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/orders/:id → update order status (admin use)
router.put("/:id", checkJwt, checkRole(["admin"]), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // For now, only status update allowed
    order.status = req.body.status || order.status;
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Order update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/orders/:id → delete order (owner or admin)
router.delete("/:id", checkJwt, checkRole(["user","admin"]), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const roles = req.auth[process.env.AUTH0_ROLES_NAMESPACE] || [];
    if (order.owner !== req.auth.sub && !roles.includes("admin"))
      return res.status(403).json({ message: "Access denied" });

    await order.deleteOne();
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
