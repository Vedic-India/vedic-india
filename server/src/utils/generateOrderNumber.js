export const generateOrderNumber = (orderId) => {
    const date = new Date();

    const formattedDate =
        date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0");

    const uniqueId = orderId.toString().slice(-6).toUpperCase();

    return `VI-${formattedDate}-${uniqueId}`;
};