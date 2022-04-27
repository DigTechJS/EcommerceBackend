const express=require("express");
const { getAllProducts ,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview} = require("../controllers/productController");
const { isAuthenticatedError,authorizeRoles } = require("../middleware/auth");
const router= express.Router();

router.route("/products").get( getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedError,authorizeRoles("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthenticatedError,authorizeRoles("admin"),updateProduct).delete(isAuthenticatedError,authorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedError,createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedError, deleteReview);

module.exports=router
