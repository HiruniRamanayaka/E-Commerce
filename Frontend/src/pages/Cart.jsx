import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Cart = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) return loginWithRedirect(); // redirect to login
    navigate("/checkout");
  };

  const handleAdd = (item) => {
    if (!isAuthenticated) return loginWithRedirect();
    addToCart(item);
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
