import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../services/axios.js";

const Payment = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
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
        const token = await getAccessTokenSilently();
        const res = await api.post("/api/payments/initiate", { orderId }, { headers: { Authorization:`Bearer ${token}` } });
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || err.message);
      }
    };
    initiatePayment();
  }, [isAuthenticated, orderId, getAccessTokenSilently]);

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