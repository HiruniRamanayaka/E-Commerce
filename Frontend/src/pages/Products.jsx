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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-800 text-xl">
        Loading products...
      </div>
    );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-white text-red-500 text-lg">
      {error}
    </div>
  )

  return (
    <div className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center tracking-wide">
          Explore Our Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 p-4"
            >
              <ProductCard product={p} onAdd={handleAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
