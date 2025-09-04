import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useApi } from "../services/api.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { getProducts } = useApi();

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
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
