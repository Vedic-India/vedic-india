import api from "@/lib/axios";

export const changeCurrentPassword = async (passwordData) => {
  const { data } = await api.patch(
    "/users/change-password",
    passwordData
  );

  return data.data;
};

export const updateName = async (name) => {
  const { data } = await api.patch("/users/update-name", {
    name,
  });

  return data.data;
};

export const updatePhone = async (phone) => {
  const { data } = await api.patch("/users/update-phone", {
    phone,
  });

  return data.data;
};

export const addAddress = async (addressData) => {
  const { data } = await api.patch(
    "/users/add-address",
    addressData
  );

  return data.data;
};

export const editAddress = async (addressId, addressData) => {
  const { data } = await api.patch(
    `/users/edit-address/${addressId}`,
    addressData
  );

  return data.data;
};

export const deleteAddress = async (addressId) => {
  const { data } = await api.delete(
    `/users/delete-address/${addressId}`
  );

  return data.data;
};

export const makeAddressDefault = async (addressId) => {
  const { data } = await api.patch(
    `/users/make-default-address/${addressId}`
  );

  return data.data;
};