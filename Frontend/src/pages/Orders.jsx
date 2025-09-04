import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";

const Order = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { getOrders, cancelOrder } = useApi();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await cancelOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <p>Checking authentication...</p>;
  if (!isAuthenticated) return <p>Please log in to see your orders.</p>;
  if (loadingOrders) return <p>Loading your orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} style={{ marginBottom: "1rem", border: "1px solid #ddd", padding: "1rem" }}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Delivery:</strong> {order.delivery?.date} ({order.delivery?.paymentMethod})</p>
              {order.status === "pending" && (
                <div style={{ marginTop: "1rem" }}>
                    <button
                        onClick={() => handleDelete(order._id)}
                        style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}
                    >
                        Cancel Order
                    </button>
                </div>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Order;
