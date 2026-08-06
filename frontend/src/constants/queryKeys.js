export const queryKeys = {
  currentUser: ["currentUser"],

  products: ["products"],

  product: (slug) => ["product", slug],

  cart: ["cart"],

  orders: ["orders"],

  order: (orderId) => ["order", orderId],

  adminOrders: ["adminOrders"],

  adminOrder: (orderId) => ["adminOrder", orderId],
};