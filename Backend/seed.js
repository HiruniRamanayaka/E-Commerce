import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"
import connectDB from "./config/db.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear old data
    await Product.deleteMany();

    // Sample products
    const products = [
      {
        name: "iPhone 15 Pro",
        price: 1299,
        description: "Apple’s latest flagship with A17 Pro chip and titanium body.",
        stock: 20,
        imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1756849050/iPhone_15_Pro_v88pe2.jpg",
        category: "Smartphones",
        brand: "Apple",
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        price: 1199,
        description: "High-performance Android phone with powerful camera features.",
        stock: 15,
        imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1756849049/Samsung_Galaxy_S24_Ultra_iovvpd.png",
        category: "Smartphones",
        brand: "Samsung",
      },
      {
        name: "Sony WH-1000XM5",
        price: 399,
        description: "Premium noise-cancelling wireless headphones.",
        stock: 30,
        imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1756849048/Sony_WH-1000XM5_qbblr4.jpg",
        category: "Audio",
        brand: "Sony",
      },
      {
        name: "Dell XPS 15",
        price: 1799,
        description: "Powerful laptop with Intel i9 and OLED display.",
        stock: 10,
        imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1756849047/Dell_XPS_15_furipo.jpg",
        category: "Laptops",
        brand: "Dell",
      },
      {
        name: "Nike Air Max 270",
        price: 150,
        description: "Stylish and comfortable sneakers for everyday wear.",
        stock: 50,
        imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1756849047/Nike_Air_Max_270_p7fudu.jpg",
        category: "Footwear",
        brand: "Nike",
      },
    ];

    await Product.insertMany(products);

    console.log(" Products seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(" Error seeding products:", err);
    process.exit(1);
  }
};

seedProducts();
