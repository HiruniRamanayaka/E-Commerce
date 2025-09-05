import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useApi } from "../services/api.js";

const Home = () => {
  const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { getProducts } = useApi();

  useEffect(() => {
    getProducts()
    .then(setProducts)
    .catch((err) => setError(err.message || "Failed to load products"))
    .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) return loginWithRedirect(); // redirect to login
    addToCart(product);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onAdd={handleAddToCart} />
      ))}
    </div>
  );
};

export default Home;
