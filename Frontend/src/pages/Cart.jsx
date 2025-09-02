import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Cart = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { cartItems, removeFromCart, addToCart, deleteFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) return loginWithRedirect(); // redirect to login
    navigate("/checkout");
  };

  const handleAdd = (item) => {
    if (!isAuthenticated) return loginWithRedirect();
    addToCart(item);
  };

  const handleDelete = (productId) => {
  if (window.confirm("Remove this item from your cart?")) {
    deleteFromCart(productId);
    }
  };

  if (cartItems.length === 0) return <p>Your cart is empty</p>;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item._id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <img src={item.imageUrl} alt={item.name} style={{ width: "80px" }} />
          <div>
            <h3>{item.name}</h3>
            <p>Qty: {item.quantity}</p>
            <button onClick={() => addToCart(item)}>+</button>
            <button onClick={() => removeFromCart(item._id)}  disabled={item.quantity <= 1}>-</button>
            <button onClick={() => handleDelete(item._id)} style={{ color: "red" }}>Remove From Cart</button>
          </div>
        </div>
      ))}
      <p><strong>Total:</strong> ${total}</p>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
