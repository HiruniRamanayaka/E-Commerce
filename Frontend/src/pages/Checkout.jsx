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
  const [formErrors, setFormErrors] = useState({});

  const districts = ["Colombo", "Gampaha", "Kandy", "Kurunegala", "Matara"];
  const deliveryTimes = ["10 AM", "11 AM", "12 PM"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [e.target.name]: e.target.value });
    validateField(name, value);
  };

  // Prevent selecting past dates or Sundays
  const getMinDate = () => {
    const now = new Date();
    const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    return iso;
  };

  const isSunday = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDay() === 0;
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "name" && value.trim() === "") {
      error = "Name is required";
    }
    if (name === "phone") {
      if (!/^\d{10}$/.test(value)) {
        error = "Phone number must be exactly 10 digits";
      }
    }
    if (name === "address" && value.trim() === "") {
      error = "Address is required";
    }
    if (name === "district" && value === "") {
      error = "Please select a district";
    }
    if (name === "deliveryTime" && value === "") {
      error = "Please select a delivery time";
    }
    if (name === "paymentMethod" && value === "") {
      error = "Please select a payment method";
    }
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) return loginWithRedirect();
    if (cartItems.length === 0) return setMessage("Cart is empty");

    const selected = new Date(form.deliveryDate);
    const now = new Date();
    if (isNaN(selected.getTime()) || selected < now) {
      return setMessage("Delivery date must be today or in the future.");
    }
    if (selected.getDay() === 0) {
      return setMessage("Delivery cannot be scheduled on Sundays.");
    }
    
    const token = await getAccessTokenSilently();
    const order = {
      items: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      total,
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
      const createdOrder = await createOrder(order);

      if (form.paymentMethod === "Card") {
        setCartItems([]);
        navigate("/payment", { 
          state: { 
            orderId: createdOrder._id, 
            total } 
        });
      } else {
        setMessage("Order placed successfully!");
        setCartItems([]);
      }
    } catch (err) {
        setMessage(err.response?.data?.message || err.message);
    }
  };

    
  return (
    <div className="bg-white min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Checkout</h2>
        <p className="text-lg text-gray-700 mb-4 text-center">
          <strong>Total to Pay:</strong> ${total.toFixed(2)}
        </p>
        
        {message && (
          <div className={`mb-4 text-center text-sm font-medium ${
            message === "Order placed successfully!" ? "text-green-700" : "text-red-600"
          }`}>
            {message}
          </div>
        )}
        
        {/* Show redirect button only after successful order */}
        {message === "Order placed successfully!" && (
          <div className="text-center mb-6">
             <div className="inline-block bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md shadow-sm mb-4">
                Your order has been placed successfully!
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <input 
              name="name" 
              placeholder="Name" 
              onChange={handleChange} 
              required 
              className={`p-3 border 
                ${formErrors.name ? "border-red-500" : "border-gray-300"} 
                rounded-md focus:outline-none focus:ring-2 
                ${formErrors.name ? "focus:ring-red-500" : "focus:ring-blue-500"} 
                w-full`}
              />
              {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <input 
                name="phone" 
                placeholder="Phone" 
                onChange={handleChange} 
                required 
                className={`p-3 border 
                  ${formErrors.phone ? "border-red-500" : "border-gray-300"} 
                  rounded-md focus:outline-none focus:ring-2 
                  ${formErrors.phone ? "focus:ring-red-500" : "focus:ring-blue-500"} 
                  w-full`}
              />
              {formErrors.phone && <p className="text-sm text-red-600 mt-1">{formErrors.phone}</p>}
            </div>
          </div>

          <div>
            <input 
              name="address" 
              placeholder="Address" 
              onChange={handleChange} 
              required 
              className={`p-3 border ${
                formErrors.address ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 ${
                formErrors.address ? "focus:ring-red-500" : "focus:ring-blue-500"
              } w-full`}
            />
            {formErrors.address && (
              <p className="text-sm text-red-600 mt-1">{formErrors.phone}</p>
            )}
          </div>  

          <div>
            <select 
              name="district" 
              onChange={handleChange} 
              required
              className={`p-3 border 
                ${formErrors.district ? "border-red-500" : "border-gray-300"} 
                rounded-md focus:outline-none focus:ring-2 
                ${formErrors.district ? "focus:ring-red-500" : "focus:ring-blue-500"} 
                w-full bg-white`}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {formErrors.district && (
              <p className="text-sm text-red-600 mt-1">{formErrors.district}</p>
            )}
          </div>

          <div>
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
              className={`p-3 border ${
                formErrors.deliveryDate ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 ${
                formErrors.deliveryDate ? "focus:ring-red-500" : "focus:ring-blue-500"
              } w-full`}
            />
            {formErrors.deliveryDate && (
              <p className="text-sm text-red-600 mt-1">{formErrors.deliveryDate}</p>
            )}
          </div>

          <div>
            <select 
              name="deliveryTime" 
              onChange={handleChange} 
              required
              className={`p-3 border ${
                formErrors.deliveryTime ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 ${
                formErrors.deliveryTime ? "focus:ring-red-500" : "focus:ring-blue-500"
              } w-full`}
            >
              <option value="">Select Delivery Time</option>
              {deliveryTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {formErrors.deliveryTime && (
              <p className="text-sm text-red-600 mt-1">{formErrors.deliveryTime}</p>
            )}
          </div>

          <div>
            <select 
              name="paymentMethod" 
              onChange={handleChange} 
              required
              className={`p-3 border ${
                formErrors.paymentMethod ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 ${
                formErrors.paymentMethod ? "focus:ring-red-500" : "focus:ring-blue-500"
              } w-full`}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
            {formErrors.paymentMethod && (
              <p className="text-sm text-red-600 mt-1">{formErrors.paymentMethod}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Delivery instructions (optional)"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {form.paymentMethod === "Card" && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm">
              You’ll be redirected to a secure payment page after placing your order.
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-[#0a1f44] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >Place Order
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Checkout;
