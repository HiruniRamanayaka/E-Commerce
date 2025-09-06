import express from "express";
import Product from "../models/Product.js";
import {checkJwt } from "../middleware/authMiddleware.js";
import {checkRole } from "../middleware/roleMiddleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { productSchema } from "../validators/product.js";

const router = express.Router();

// GET /api/products → return all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id → return single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) POST /api/products → add new product (future admin use)
router.post("/", checkJwt, checkRole(["admin"]), validateBody(productSchema), async (req, res) => {
  try {
    const { name, price, description, stock, imageUrl, category, brand } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      stock,
      imageUrl,
      category,
      brand,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
