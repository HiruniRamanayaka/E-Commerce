// src/services/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getProducts = async () => {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const createOrder = async (order, token) => {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
};

export const getOrders = async (token) => {
  const res = await fetch(`${API_BASE}/api/orders/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};
