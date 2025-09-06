import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";
import { Link } from "react-router-dom";

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

  if (isLoading) 
    return <div className="text-center py-12 text-gray-600">Checking authentication...</div>;
  if (!isAuthenticated) 
    return <div className="text-center py-12 text-gray-600">Please log in to see your orders.</div>;
  if (loadingOrders) 
    return <div className="text-center py-12 text-gray-600">Loading your orders...</div>;
  if (error) 
    return <div className="text-center py-12 text-red-600 font-medium">Error: {error}</div>;

  return (
    <div className="bg-white min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0a1f44] mb-8 text-center">My Orders</h2>
      
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
              <p className="text-sm text-gray-600 mb-6">
                You haven’t placed any orders yet. Once you do, they’ll appear here.
              </p>
              <Link
                to="/products"
                className="inline-block px-6 py-2 bg-[#0a1f44] text-white rounded-md hover:bg-blue-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Delivery</th>
                    <th className="px-4 py-3 text-left">Payment</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{order._id}</td>
                        <td className="px-4 py-3 font-semibold">
                          <span
                            className={`${
                              order.status === "pending"
                                ? "text-yellow-600"
                                : order.status === "completed"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          <ul className="list-disc list-inside">
                            {order.items.map((item, i) => (
                              <li key={i}>
                                {item.name} × {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-3 text-blue-700 font-semibold">
                          LKR {order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {order.delivery?.date
                            ? new Date(order.delivery.date).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {order.delivery?.paymentMethod || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          {order.status === "pending" && (
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
    </div>
  );
};

export default Order;
