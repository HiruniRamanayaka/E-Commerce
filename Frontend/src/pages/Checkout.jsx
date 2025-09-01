import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

const Checkout = () => {
  const { cartItems, setCartItems } = useCart();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    district: "",
    deliveryDate: "",
    paymentMethod: "Cash",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return setMessage("Cart is empty");

    const order = {
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      contact: {
        name: form.name,
        address: form.address,
        phone: form.phone,
        district: form.district,
      },
      delivery: {
        date: new Date(form.deliveryDate),   // convert to Date
        paymentMethod: form.paymentMethod,
      },
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Failed to place order");

      setMessage("Order placed successfully!");
      setCartItems([]); // clear cart
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="district" placeholder="District" onChange={handleChange} required />
        <input
          type="datetime-local"
          name="deliveryDate"
          onChange={handleChange}
          required
        />
        <select name="paymentMethod" onChange={handleChange} required>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
