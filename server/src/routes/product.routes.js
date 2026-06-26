import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct,
    toggleProductStatus,
    getAllProductsAdmin 
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { roleCheck } from "../middlewares/roleCheck.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route("/")
    .get(getAllProducts)
    .post(
        verifyJWT,
        roleCheck("admin"),
        upload.array("images", 5),
        createProduct
    )

router.route("/admin").get(
    verifyJWT,
    roleCheck("admin"),
    getAllProductsAdmin
)

router.route("/:slug/status").patch(
    verifyJWT,
    roleCheck("admin"),
    toggleProductStatus
)

router.route("/:slug")
    .get(getProductBySlug)
    .patch(
        verifyJWT,
        roleCheck("admin"),
        updateProduct
    )

export default router;