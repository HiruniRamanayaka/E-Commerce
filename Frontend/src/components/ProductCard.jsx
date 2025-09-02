import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAdd }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem" }}>
      <Link to={`/product/${product._id}`}>
      <img
          src={product.imageUrl || "/default-image.jpg"}
          alt={product.name}
          style={{ width: "100%", height: "auto", objectFit: "cover", marginBottom: "0.5rem" }}
        />
          <h3>{product.name}</h3> 
      </Link>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <button onClick={() => onAdd(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
