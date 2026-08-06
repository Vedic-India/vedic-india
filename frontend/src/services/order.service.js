import api from "@/lib/axios";

export const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data.data;
};

export const verifyPayment = async (paymentData) => {
  const { data } = await api.patch("/orders/verify-payment", paymentData);
  return data.data;
};

export const getMyOrders = async (params = {}) => {
  const { data } = await api.get("/orders/my-orders", { params });
  return data.data;
};

export const getOrderById = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data.data;
};

export const getAllOrders = async (params = {}) => {
  const { data } = await api.get("/orders/admin", { params });
  return data.data;
};

export const markOrderPaid = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/mark-paid`);
  return data.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
  const { data } = await api.patch(`/orders/${orderId}/status`, statusData);
  return data.data;
};

export const cancelOrder = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}`);
  return data.data;
};