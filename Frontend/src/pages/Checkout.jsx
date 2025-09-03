import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth0 } from "@auth0/auth0-react";

const Checkout = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

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
    if (cartItems.length === 0) return setMessage("Cart is empty");
    // Get token here
    let token = null;
    if (isAuthenticated) {
      token = await getAccessTokenSilently();
    } else {
      setMessage("Please log in to place order");
      return;
    }

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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      const createdOrder = await res.json();

      if (!res.ok) {
        throw new Error(errorData.message || "Failed to place order");
      }

      if (form.paymentMethod === "Card") {
        setCartItems([]);
        navigate("/payment", {
          state: {
            orderId: createdOrder._id,
            total,
          },
        });
      } else {
        setMessage("Order placed successfully!");
        setCartItems([]);
      }
    } catch (err) {
      setMessage(err.message);
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
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        
        <select name="district" onChange={handleChange} required>
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

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

        <select name="deliveryTime" onChange={handleChange} required>
          <option value="">Select Delivery Time</option>
          {deliveryTimes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select name="paymentMethod" onChange={handleChange} required>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>

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
