import api from "./axios.js"; // the axios instance
import { useAuth0 } from "@auth0/auth0-react";

// Hook to use API calls with Auth0 token
export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const withToken = async (callback) => {
  try {
    const token = await getAccessTokenSilently({ cacheMode: 'off' });
    return await callback(token);
  } catch (err) {
    console.error("Token retrieval or callback failed:", err);
    throw err;
  }
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
    try{
      return withToken(async (token) => {
        const res = await api.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      });
    } catch (err){
      console.error("getOrders failed:", err);
      throw err;
    }
  };

  const cancelOrder = async (orderId) => {
    try{
      return withToken(async (token) => {
        const res = await api.delete(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      });
    } catch (err){
      console.error("cancelOrders failed:", err);
      throw err;
    }
  };

  const getProfile = async () => {
    try{
      return withToken(async (token) => {
        const res = await api.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      });
    } catch (err) {
      console.error("getProfile failed:", err);
      throw err;
    }
  };

  const updateProfile = async (profile) => {
    try{
      return withToken(async (token) => {
        const res = await api.put("/api/users/profile", profile, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      });
    } catch(err) {
      console.error("updateProfile failed:", err);
      throw err;
    }
  };

  const initiatePayment = async (orderId) => {
    try{
      return withToken(async (token) => {
        const res = await api.post(
          "/api/payments/initiate",
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
      });
    } catch(err) {
      console.error("initiatePayment failed:", err);
      throw err;
    }
  };

  const createOrder = async (order) => {
    try{
      return withToken(async (token) => {
        const res = await api.post("/api/orders", order, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      });
    } catch (err) {
      console.error("createOrders failed:", err);
      throw err;
    }
  };

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
