import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/axios.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Product fetch error:", err.message);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) return loginWithRedirect(); // redirect to login
    addToCart(product);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onAdd={handleAddToCart} />
      ))}
    </div>
  );
};

export default Home;
