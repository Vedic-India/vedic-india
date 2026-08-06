import { Router } from "express";
import { 
    createOrder, 
    verifyPayment, 
    getMyOrders, 
    getOrderById, 
    getAllOrders, 
    markOrderPaid, 
    updateOrderStatus, 
    cancelOrder 
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { roleCheck } from "../middlewares/roleCheck.middleware.js";

const router = Router();

router.use(verifyJWT);

// Customer
router.route("/")
    .post(createOrder);

router.route("/verify-payment")
    .patch(verifyPayment);

router.route("/my-orders")
    .get(getMyOrders);

// Admin
router.route("/admin")
    .get(roleCheck("admin"), getAllOrders);

router.route("/:orderId/mark-paid")
    .patch(roleCheck("admin"), markOrderPaid);

router.route("/:orderId/status")
    .patch(roleCheck("admin"), updateOrderStatus);

// Generic parameterized route LAST
router.route("/:orderId")
    .get(getOrderById)
    .patch(cancelOrder);

export default router;