import { ApiError } from "../utils/ApiError.js";

export const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, 'Access denied');
    }
    next();
  };
};

