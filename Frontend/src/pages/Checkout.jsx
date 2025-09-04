import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";

const Checkout = () => {
  const { getAccessTokenSilently, isAuthenticated, user, loginWithRedirect } = useAuth0();
  const { cartItems, setCartItems } = useCart();
  const { createOrder } = useApi();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    district: "",
    deliveryDate: "",
    deliveryTime: "",
    paymentMethod: "Cash",
    message: "",
  });

  const [message, setMessage] = useState("");

  const districts = ["Colombo", "Gampaha", "Kandy", "Kurunegala", "Matara"];
  const deliveryTimes = ["10 AM", "11 AM", "12 PM"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return loginWithRedirect();
    if (cartItems.length === 0) return setMessage("Cart is empty");
    
    const token = await getAccessTokenSilently();
    const order = {
      owner: user?.sub,
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
        time: form.deliveryTime,
        paymentMethod: form.paymentMethod,
        message: form.message,
      },
    };

    try {
      const createdOrder = await createOrder(order, token);

      if (form.paymentMethod === "Card") {
        setCartItems([]);
        navigate("/payment", { state: { 
          orderId: createdOrder._id, 
          total 
        } });
      } else {
        setMessage("Order placed successfully!");
        setCartItems([]);
      }
    } catch (err) {
        setMessage(err.response?.data?.message || err.message);
    }
  };

  // Prevent selecting past dates or Sundays
  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().slice(0, 16); // format for datetime-local
  };

  const isSunday = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDay() === 0;
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p><strong>Total to Pay:</strong> ${total.toFixed(2)}</p>
      <div>
        {message && <p>{message}</p>}
        {/* Show redirect button only after successful order */}
        {message === "Order placed successfully!" && (
          <button onClick={() => navigate("/")}>Go to Home</button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <label>Address</label>
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <label>Phone</label>
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <label>District: </label>
        <select name="district" onChange={handleChange} required>
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <label>Date of purchase: </label>
        <input
          type="datetime-local"
          name="deliveryDate"
          onChange={(e) => {
            if (isSunday(e.target.value)) {
              setMessage("Delivery cannot be scheduled on Sundays.");
              setForm({ ...form, deliveryDate: "" });
            } else {
              setMessage("");
              handleChange(e);
            }
          }}
          min={getMinDate()}
          required
        />
        <label>Preferred Delivery Time: </label>
        <select name="deliveryTime" onChange={handleChange} required>
          <option value="">Select Delivery Time</option>
          {deliveryTimes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <label>Payment Method: </label>
        <select name="paymentMethod" onChange={handleChange} required>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
        <label>Message: </label>
        <textarea
          name="message"
          placeholder="Delivery instructions (optional)"
          onChange={handleChange}
        />

        {form.paymentMethod === "Card" && (
          <p style={{ color: "#856404", backgroundColor: "#fff3cd", padding: "0.5rem" }}>
            You’ll be redirected to a secure payment page after placing your order.
          </p>
        )}

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
