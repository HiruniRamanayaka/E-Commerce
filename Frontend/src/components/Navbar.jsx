import React from "react";
import { Link } from "react-router-dom"; 
import { useCart } from "../context/CartContext.jsx";
import { LoginButton } from "./LoginButton.jsx";
import { LogoutButton } from "./LogoutButton.jsx";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user } = useAuth0();

  return (
    <nav style={{ padding: "1rem", background: "#eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h1>My Shop</h1>
        <Link to="/">Home</Link>{" | "}
        <Link to="/cart">Cart ({cartCount})</Link>
      </div>

      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: "1rem" }}>
              Hi, {user?.name || "User"}
            </span>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
