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
  // 🪑 Desk & Office (7 items)
  {
    name: "Adjustable Desk Lamp",
    price: 1200, // LKR
    description: "LED desk lamp with brightness adjustment.",
    stock: 30,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180560/Adjustable_Desk_Lamp_c0irb0.jpg",
    category: "Desk and Office",
    brand: "Philips",
  },
  {
    name: "Wooden Desk Organizer",
    price: 800,
    description: "Organizer for pens, papers, and stationery.",
    stock: 40,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180546/Wooden_Desk_Organizer_uyycvu.jpg",
    category: "Desk and Office",
    brand: "IKEA",
  },
  {
    name: "Ergonomic Foot Rest",
    price: 1500,
    description: "Comfortable under-desk footrest for long hours.",
    stock: 20,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180546/Ergonomic_Foot_Rest_pwi0oh.jpg",
    category: "Desk and Office",
    brand: "Fellowes",
  },
  {
    name: "Magnetic Whiteboard",
    price: 2500,
    description: "Wall-mounted whiteboard for planning and notes.",
    stock: 15,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180546/Magnetic_Whiteboard_qwpvpk.jpg",
    category: "Desk and Office",
    brand: "Quartet",
  },
  {
    name: "Compact Writing Desk",
    price: 4900,
    description: "Wooden desk with drawer for home office.",
    stock: 12,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180546/Compact_Writing_Desk_arddjb.jpg",
    category: "Desk and Office",
    brand: "Urban Ladder",
  },
  {
    name: "Desk Plant (Succulent)",
    price: 600,
    description: "Small decorative plant for your desk.",
    stock: 35,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180545/Desk_Plant_Succulent_zsfw2d.jpg",
    category: "Desk and Office",
    brand: "IKEA",
  },
  {
    name: "Adjustable Laptop Stand",
    price: 1900,
    description: "Portable stand to improve ergonomics while working.",
    stock: 20,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180545/Adjustable_Laptop_Stand_zf6tdi.jpg",
    category: "Desk and Office",
    brand: "AmazonBasics",
  },

  // 📓 Self-Improvement (7 items)
  {
    name: "Gratitude Journal",
    price: 950,
    description: "Daily journal to boost mindfulness and positivity.",
    stock: 30,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180546/Gratitude_Journal_v07fx0.avif",
    category: "Self-Improvement",
    brand: "Clever Fox",
  },
  {
    name: "Daily Planner",
    price: 1200,
    description: "Plan your day effectively with this planner.",
    stock: 25,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180544/Daily_Planner_elonkn.jpg",
    category: "Self-Improvement",
    brand: "Moleskine",
  },
  {
    name: "Habit Tracker Notebook",
    price: 800,
    description: "Track your habits and personal goals.",
    stock: 35,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180545/Habit_Tracker_Notebook_iw7zza.jpg",
    category: "Self-Improvement",
    brand: "Panda Planner",
  },
  {
    name: "Motivational Desk Calendar",
    price: 650,
    description: "Inspirational daily quotes to stay motivated.",
    stock: 40,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180544/Motivational_Desk_Calendar_vbvei2.jpg",
    category: "Self-Improvement",
    brand: "InspireCo",
  },
  {
    name: "Mindfulness Coloring Book",
    price: 500,
    description: "Stress-relieving coloring book for adults.",
    stock: 50,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180545/Mindfulness_Coloring_Book_rlerjm.jpg",
    category: "Self-Improvement",
    brand: "Johanna Basford",
  },
  {
    name: "Guided Meditation Book",
    price: 1500,
    description: "Learn meditation techniques for mental clarity.",
    stock: 20,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180546/Guided_Meditation_Book_m0g1b0.jpg",
    category: "Self-Improvement",
    brand: "Thich Nhat Hanh",
  },
  {
    name: "Daily Affirmation Cards",
    price: 950,
    description: "Deck of cards with positive affirmations.",
    stock: 35,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180545/Daily_Affirmation_Cards_pousae.jpg",
    category: "Self-Improvement",
    brand: "Affirmation Deck",
  },

  // 🎒 Travel (6 items)
  {
    name: "Travel Backpack",
    price: 4200,
    description: "Durable backpack with multiple compartments for travel.",
    stock: 15,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180543/Travel_Backpack_slizso.jpg",
    category: "Travel",
    brand: "Osprey",
  },
  {
    name: "Neck Pillow",
    price: 1200,
    description: "Memory foam pillow for comfortable travel.",
    stock: 35,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180543/Neck_Pillow_u4ucof.jpg",
    category: "Travel",
    brand: "Cabeau",
  },
  {
    name: "Packing Cubes Set",
    price: 900,
    description: "Organize clothes efficiently in luggage.",
    stock: 30,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180543/Packing_Cubes_Set_mcorcr.jpg",
    category: "Travel",
    brand: "Eagle Creek",
  },
  {
    name: "Reusable Water Bottle",
    price: 600,
    description: "Insulated bottle for hydration on the go.",
    stock: 45,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180543/Reusable_Water_Bottle_oiaq1j.jpg",
    category: "Travel",
    brand: "Hydro Flask",
  },
  {
    name: "Travel Toiletry Bag",
    price: 800,
    description: "Compact bag to organize toiletries for trips.",
    stock: 25,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757180543/Travel_Toiletry_Bag_ee4vdu.avif",
    category: "Travel",
    brand: "Nomad Lane",
  },
  {
    name: "Luggage Tag Set",
    price: 400,
    description: "Set of colorful tags to identify your luggage easily.",
    stock: 50,
    imageUrl: "https://res.cloudinary.com/dgjs19uyt/image/upload/v1757181163/Luggage_Tag_Set_kulicv.jpg",
    category: "Travel",
    brand: "Samsonite",
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
