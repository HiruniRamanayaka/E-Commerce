import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products → return all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
