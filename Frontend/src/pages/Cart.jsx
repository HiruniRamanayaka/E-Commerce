import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { cartItems, removeFromCart, addToCart, deleteFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) return loginWithRedirect(); // redirect to login
    navigate("/checkout");
  };

  const handleAdd = (item) => {
    if (!isAuthenticated) return loginWithRedirect();
    addToCart(item);
  };

  const handleDelete = (productId) => {
  if (window.confirm("Remove this item from your cart?")) {
    deleteFromCart(productId);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) 
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-600 text-lg">
        Your cart is empty
      </div>
    );

  return (
    <div className="bg-white min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Cart</h2>

        <div className="space-y-6">
          {cartItems.map((item) => (
            <div 
              key={item._id} 
              className="flex flex-col sm:flex-row items-center gap-6 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">Price: {item.price}</p>
                <p className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleAdd(item)} 
                  disabled={!isAuthenticated} 
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  title="Increase quantity"
                >
                  <FiPlus className="text-lg" />
                </button>
                <button 
                  onClick={() => removeFromCart(item._id)}  
                  disabled={!isAuthenticated || item.quantity <= 1}
                  className={`p-2 rounded transition duration-300 ${
                    item.quantity > 1 && isAuthenticated
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-800 opacity-50 cursor-not-allowed"
                  }`}
                  title="Decrease quantity"
                >
                  <FiMinus className="text-lg" />
                </button>
                <button 
                  onClick={() => handleDelete(item._id)} 
                  disabled={!isAuthenticated} 
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  title="Remove from cart"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-right">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            Total:<span className="text-blue-700"> LKR {total.toFixed(2)}</span>
          </p>
          <button 
            onClick={handleCheckout}
            className="px-6 py-3 bg-[#0a1f44] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
