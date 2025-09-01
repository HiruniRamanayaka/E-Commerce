import React from "react";
import { Link } from "react-router-dom"; 
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { cartCount } = useCart();
  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <h1>My Shop</h1>
      <Link to="/">Home</Link>          {/* Go to Home */}
      <Link to="/cart">Cart ({cartCount})</Link>   {/* Go to Cart */}
    </nav>
  );
};

export default Navbar;
