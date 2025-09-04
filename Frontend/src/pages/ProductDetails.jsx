import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { getProductById } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    getProductById(id).then(setProduct).catch(console.error);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const handleAdd = () => {
    if (!isAuthenticated) return loginWithRedirect({ appState: { returnTo: `/product/${product._id}` } });
    addToCart(product);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate("/checkout");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: "300px" }} />
      <h2>{product.name}</h2>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      {product.category && <p><strong>Category:</strong> {product.category}</p>}
      {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}

      <button onClick={handleAdd}>Add to Cart</button>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default ProductDetails;
