import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";
import logo from "../assets/logo1.png"; 

const Payment = () => {
  const { isAuthenticated } = useAuth0();
  const { initiatePayment } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};
  const [message, setMessage] = useState("");
  const [redirectURL, setRedirectURL] = useState("");

  useEffect(() => {
    const startPayment = async () => {
      if (!isAuthenticated || !orderId) {
        setMessage("Unauthorized access.");
        return;
      }
      try {
        const data = await initiatePayment(orderId);
        setMessage(data.message);

        // Redirect to mock gateway
        if (data.redirectURL) {
          setRedirectURL(data.redirectURL);
        }

      } catch (err) {
        setMessage(err.response?.data?.message || err.message || "Payment failed");
      }
    };
    startPayment();
  }, [isAuthenticated, orderId]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-l w-full bg-gray-50 rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="ShopMart Logo" className="h-20 w-auto" />
        </div>
      <h2 className="text-3xl font-bold text-[#0a1f44] mb-4 text-center">Secure Payment</h2>
      <p className="text-lg text-gray-700 mb-6 text-center">
        <strong>Total to Pay:</strong> ${Number(total || 0).toFixed(2)}
      </p>

      <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md mb-6 text-center text-sm">
          {message || "Preparing payment..."}
        </div>

      {redirectURL && (
        <div className="text-center">
          <a
            href={redirectURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-[#0a1f44] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Proceed to Payment Gateway
          </a>
        </div>
      )}
    </div>
  </div>
  );
};

export default Payment;