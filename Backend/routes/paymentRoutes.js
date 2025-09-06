import express from "express";
import { checkJwt } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { initiatePaymentSchema, confirmPaymentSchema } from "../validators/payment.js";

const router = express.Router();

// POST /api/payments/initiate → mark order as awaiting payment
router.post("/initiate", checkJwt, checkRole(["user"]), validateBody(initiatePaymentSchema), async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const { orderId } = req.body;

    const order = await Order.findOne({ _id: orderId, owner: auth0Id });

    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized." });
    }

    if (order.delivery.paymentMethod !== "Card") {
      return res.status(400).json({ message: "Payment method is not Card." });
    }

    order.status = "awaiting-payment";
    await order.save();

    res.json({
      message: "Payment initiated. Redirect to gateway.",
      total: order.total,
      orderId: order._id,
      redirectURL: `https://mock-payment-gateway.com/pay?order=${order._id}`,
    });
  } catch (err) {
    console.error("Payment initiation error:", err);
    res.status(500).json({ message: "Server error during payment initiation." });
  }
});


router.post("/confirm", checkJwt, checkRole(["user"]), validateBody(confirmPaymentSchema), async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;
    const order = await Order.findOne({ _id: orderId, owner: req.auth.sub });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.transactionId = transactionId;
    order.status = "confirmed";
    await order.save();

    res.json({ message: "Payment confirmed", order });
  } catch (err) {
    console.error("Payment confirmation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;