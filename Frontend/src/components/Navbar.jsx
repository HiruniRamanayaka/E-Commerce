import React from "react";
import { NavLink } from "react-router-dom"; 
import { useCart } from "../context/CartContext.jsx";
import { LoginButton } from "./LoginButton.jsx";
import { SignupButton } from "./SignupButton.jsx";
import { LogoutButton } from "./LogoutButton.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/logo1.png"; 
import { FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user } = useAuth0();
  const linkBase = "font-semibold transition duration-200 hover:text-black";

  return (
    <nav className="bg-white text-blue-900 px-6 py-4 flex justify-between items-center shadow-sm border-b border-gray-300 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <img src={logo} alt="Logo" className="h-15 w-auto" />
        
        {/* Navigation Links */}
        <NavLink to="/" className={({ isActive }) =>
            `${linkBase} ${isActive ? "underline underline-offset-4 text-black" : ""}`
          }
        >Home</NavLink>
        <NavLink to="/products" className={({ isActive }) =>
            `${linkBase} ${isActive ? "underline underline-offset-4 text-black" : ""}`
          }
        >Products</NavLink>

        {isAuthenticated && <NavLink to="/orders"  className={({ isActive }) =>
                `${linkBase} ${isActive ? "underline underline-offset-4 text-black" : ""}`}
        >My Orders</NavLink>}
        {isAuthenticated && <NavLink to="/profile" className={({ isActive }) =>
                `${linkBase} ${isActive ? "underline underline-offset-4 text-black" : ""}`}
        >Profile</NavLink>}

        {/* Cart Icon with Conditional Count */}
        <NavLink to="/cart" className={({ isActive }) =>
            `relative ${isActive ? "text-black underline underline-offset-4" : "hover:text-black"} transition duration-200`
          }>
          <FiShoppingCart className="text-2xl" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm font-medium">Hi, {user?.email || "User"}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <LoginButton />
            <SignupButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
