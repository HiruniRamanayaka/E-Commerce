import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAdd }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 p-4">
      <Link to={`/product/${product._id}`} className="block">
      <img
          src={product.imageUrl || "../assets/default-image.png"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">{product.name}</h3> 
      </Link>
          <p className="text-sm text-gray-600 mt-2">{product.description}</p>
          <p className="text-base font-bold text-blue-700 mt-2">LKR {product.price}</p>
          <button onClick={() => onAdd(product)}
            className="mt-4 w-full px-4 py-2 bg-[#0a1f44] text-white rounded-md hover:bg-blue-700 transition duration-300 font-medium"
          >Add to Cart
          </button>
    </div>
  );
};

export default ProductCard;
