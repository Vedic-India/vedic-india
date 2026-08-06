import api from "@/lib/axios";
import { normalizeProduct, normalizeProducts } from "@/utils/product";

// Public APIs
export const getAllProducts = async () => {
  const { data } = await api.get("/products");
  return normalizeProducts(data?.data);
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return normalizeProduct(data?.data);
};

export const getProductByIdentifier = async (identifier) => {
  try {
    return await getProductBySlug(identifier);
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    const products = await getAllProducts();
    const matchedProduct = products.find((product) => {
      return (
        product.slug === identifier ||
        product._id === identifier ||
        product.id === identifier
      );
    });

    if (matchedProduct) {
      return matchedProduct;
    }

    throw error;
  }
};

// ====================
// Admin APIs
// ====================

export const getAllProductsAdmin = async () => {
  const { data } = await api.get("/products/admin");
  return normalizeProducts(data?.data);
};

export const createProduct = async (productData) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("stock", productData.stock);

  Array.from(productData.images ?? []).forEach((image) => {
    formData.append("images", image);
  });

  const { data } = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    ...data,
    data: normalizeProduct(data?.data),
  };
};

export const updateProduct = async (slug, productData) => {
  const { data } = await api.patch(`/products/${slug}`, {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
  });

  return {
    ...data,
    data: normalizeProduct(data?.data),
  };
};

export const toggleProductStatus = async (slug) => {
  const { data } = await api.patch(`/products/${slug}/status`);

  return {
    ...data,
    data: normalizeProduct(data?.data),
  };
};