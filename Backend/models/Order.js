import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true, index: true }, // Auth0 user ID
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1, max: 100 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    contact: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      district: { type: String, required: true },
    },
    delivery: {
      date: { type: Date, required: true },
      time: { type: String, enum: ["10 AM", "11 AM", "12 PM"], required: true },
      paymentMethod: { type: String, required: true },
      message: { type: String },
    },
    status: { type: String, default: "pending" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
