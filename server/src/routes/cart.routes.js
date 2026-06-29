import { Router } from 'express';
import { optionalVerifyJWT } from '../middlewares/optionalAuth.middleware.js';
import { getCart, clearCart, addItemToCart, removeCartItem, updateCartItemQuantity } from '../controllers/cart.controller.js';

const router = Router();

router.use(optionalVerifyJWT);

router.route("/")
    .get(getCart)
    .delete(clearCart)

router.route("/items/:productId")
    .post(addItemToCart)
    .delete(removeCartItem)
    .patch(updateCartItemQuantity);

export default router;