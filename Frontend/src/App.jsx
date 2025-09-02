import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Payment from "./pages/Payment.jsx";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
};

export default App;
