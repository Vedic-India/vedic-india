import api from "@/lib/axios";

export const registerUser = async (userData) => {
  const { data } = await api.post("/users/register", userData);
  return data.data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post("/users/login", credentials);
  return data.data;
};

export const googleLogin = async (credential) => {
  const { data } = await api.post("/users/google-login", {
    credential,
  });

  return data.data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/users/logout");
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/users/current-user");
  return data.data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.patch("/users/forgot-password", {
    email,
  });

  return data.data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.patch(`/users/reset-password/${token}`, {
    password,
  });

  return data.data;
};