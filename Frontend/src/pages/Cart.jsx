import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) return <p>Your cart is empty</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>Qty: {item.quantity}</p>
          <button onClick={() => addToCart(item)}>+</button>
          <button onClick={() => removeFromCart(item._id)}>-</button>
        </div>
      ))}
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
