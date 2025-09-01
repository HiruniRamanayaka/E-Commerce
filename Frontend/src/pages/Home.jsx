import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
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
