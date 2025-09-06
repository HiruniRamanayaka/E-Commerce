import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useCart } from "../context/CartContext";

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const { clearCart } = useCart();

  const handleLogout = () => {
    clearCart(); // remove local cart
    logout({
      logoutParams: {
        returnTo: window.location.origin, // ensures redirect & clears session
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 rounded-md bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out border border-red-600 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
    >
      Log Out
    </button>
  );
};
