import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onAdd={addToCart} />
      ))}
    </div>
  );
};

export default Home;
