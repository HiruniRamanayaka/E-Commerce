import api from "./axios.js"; // the axios instance
import { useAuth0 } from "@auth0/auth0-react";

// Hook to use API calls with Auth0 token
export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const withToken = async (callback) => {
    const token = await getAccessTokenSilently({ cacheMode: 'off' });
    return callback(token);
  };

  const getProducts = async () => {
    const res = await api.get("/api/products");
    return res.data;
  };

  const getProductById = async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  };

  const getOrders = async () => {
    return withToken(async (token) => {
      const res = await api.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    });
  };

  const cancelOrder = async (orderId) => {
    return withToken(async (token) => {
      const res = await api.delete(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    });
  };

  const getProfile = async () => {
    return withToken(async (token) => {
      const res = await api.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    });
  };

  const updateProfile = async (profile) => {
    return withToken(async (token) => {
      const res = await api.put("/api/users/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    });
  };

  const initiatePayment = async (orderId) => {
    return withToken(async (token) => {
      const res = await api.post(
        "/api/payments/initiate",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    });
  };

  const createOrder = async (order) =>
    withToken(async (token) => {
      const res = await api.post("/api/orders", order, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
  });

  return {
    getProducts,
    getProductById,
    getOrders,
    cancelOrder,
    getProfile,
    updateProfile,
    initiatePayment,
    createOrder,
  };
};
