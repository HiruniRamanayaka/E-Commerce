import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button 
      onClick={() => loginWithRedirect()}
      className="px-6 py-2 rounded-md bg-gradient-to-r from-[#0a1f22] to-black text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700"
    >
      Log In
    </button>
  );
};