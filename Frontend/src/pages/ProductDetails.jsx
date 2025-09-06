import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { getProductById } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    getProductById(id)
    .then(setProduct)
    .catch((err) => setError(err.message || "Failed to load product"));
  }, [id]);

  if (error) return (
    <div className="text-center py-12 text-red-600 font-medium">{error}</div>
  );
  if (!product) return (
    <div className="text-center py-12 text-gray-600 font-medium">Loading...</div>
  );

  const handleAdd = () => {
    if (!isAuthenticated) return loginWithRedirect({ appState: { returnTo: `/product/${product._id}` } });
    addToCart(product);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate("/checkout");
  };

  return (
    <div className="bg-white min-h-screen py-12 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-gray-50 rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-14 items-center">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full md:w-64 h-auto object-cover rounded-md shadow-sm"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#0a1f44] mb-4">{product.name}</h2>
            <p className="text-gray-700 mt-8 mb-2">
              <strong>Description:</strong> {product.description}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Stock:</strong> {product.stock}
            </p>
            {product.category && (
              <p className="text-gray-700 mb-2">
                <strong>Category:</strong> {product.category}
              </p>
            )}
            {product.brand && (
              <p className="text-gray-700 mb-2">
                <strong>Brand:</strong> {product.brand}
              </p>
            )}
            <p className="text-xl font-semibold text-blue-700 mb-6">
              Price: LKR {Number(product.price).toFixed(2)}
            </p>

            <div className="flex gap-6 mt-10">
              <button 
                onClick={handleBuyNow}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              >Buy Now
              </button>
              <button 
                onClick={handleAdd}
                className="px-6 py-2 bg-[#0a1f44] text-white rounded-md hover:bg-blue-700 transition duration-300"
              >Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
