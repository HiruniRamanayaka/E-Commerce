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

// GET /api/products/:id → return single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// (Optional) POST /api/products → add new product (future admin use)
router.post("/", async (req, res) => {
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
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
