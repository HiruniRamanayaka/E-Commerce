import React from "react";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { cartCount } = useCart();
  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <h1>My Shop</h1>
      <div>Cart: {cartCount}</div>
    </nav>
  );
};

export default Navbar;
