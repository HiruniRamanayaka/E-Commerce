import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();
await connectDB();

const seedProducts = [
  {
    name: "Laptop",
    price: 1200,
    description: "High-performance laptop",
    stock: 10,
  },
  {
    name: "Headphones",
    price: 200,
    description: "Noise-cancelling headphones",
    stock: 25,
  },
  {
    name: "Smartphone",
    price: 800,
    description: "Latest model smartphone",
    stock: 15,
  },
];

const seedDB = async () => {
  try {
    await Product.deleteMany(); // Clear old data
    await Product.insertMany(seedProducts);
    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
