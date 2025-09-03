import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Order = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch((`${import.meta.env.VITE_API_BASE_URL}/api/orders/orders`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  if (isLoading) return <p>Checking authentication...</p>;
  if (!isAuthenticated) return <p>Please log in to see your orders.</p>;
  if (loadingOrders) return <p>Loading your orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    const handleDelete = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        if (!res.ok) throw new Error("Failed to Cancel order");

        setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
        setError(err.message);
    }
    };

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
