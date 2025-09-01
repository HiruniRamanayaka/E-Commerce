import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    owner: { type: String, default: "guest" }, // placeholder until auth added
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    contact: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      district: { type: String, required: true },
    },
    delivery: {
      date: { type: Date, required: true },
      paymentMethod: { type: String, required: true },
    },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
