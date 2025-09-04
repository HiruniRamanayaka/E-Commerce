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

  useEffect(() => {
    const initiatePayment = async () => {
      if (!isAuthenticated || !orderId) {
        setMessage("Unauthorized access.");
        return;
      }
      try {
        const data = await initiatePayment(orderId);
        setMessage(data.message);
      } catch (err) {
        setMessage(err.message);
      }
    };
    initiatePayment();
  }, [isAuthenticated, orderId]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Secure Payment</h2>
      <p><strong>Total to Pay:</strong> ${total}</p>
      <p style={{ backgroundColor: "#fff3cd", padding: "1rem", borderRadius: "4px", border: "1px solid #ffeeba", color: "#856404" }}>
        {message || "Preparing payment..."}
      </p>
      <button onClick={() => navigate("/")}>Return to Home</button>
    </div>
  );
};

export default Payment;