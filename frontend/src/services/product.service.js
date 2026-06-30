import api from "@/lib/axios";

export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data.data;
};

export const getProduct = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.data;
};