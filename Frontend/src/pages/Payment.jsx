import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";

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
    <div style={{ padding: "1rem" }}>
      <h2>Secure Payment</h2>
      <p><strong>Total to Pay:</strong> ${Number(total || 0).toFixed(2)} </p>
      <p style={{ backgroundColor: "#fff3cd", padding: "1rem", borderRadius: "4px", border: "1px solid #ffeeba", color: "#856404" }}>
        {message || "Preparing payment..."}
      </p>
      {/* <button onClick={() => navigate("/")}>Return to Home</button>  */}
      {redirectURL && (
        <p>
          <a
            href={redirectURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Proceed to Payment Gateway
          </a>
        </p>
      )}
    </div>
  );
};

export default Payment;