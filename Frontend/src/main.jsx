import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-u8s4p8uj6dw7435p.us.auth0.com"
      clientId="Ckzdvhwm4MbwAHp2GkMA1XuTqv1L7FhA"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://ecommerce-api", // same as API identifier
      }}
    >
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </Auth0Provider>
  </React.StrictMode>
);
