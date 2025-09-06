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
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Log Out
    </button>
  );
};
