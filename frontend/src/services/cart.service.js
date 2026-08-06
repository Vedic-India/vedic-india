import api from "@/lib/axios";

export const getCart = async () => {
  const { data } = await api.get("/cart");
  return data.data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/cart");
  return data.data;
};

export const addItemToCart = async (productId) => {
  const { data } = await api.post(`/cart/items/${productId}`);
  return data.data;
};

export const updateCartItemQuantity = async (productId, quantity) => {
  const { data } = await api.patch(`/cart/items/${productId}`, {
    quantity,
  });

  return data.data;
};

export const removeCartItem = async (productId) => {
  const { data } = await api.delete(`/cart/items/${productId}`);
  return data.data;
};