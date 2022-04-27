const express= require("express");
const { newOrder, myOrders,SingleOrder, getAllOrders, UpdateOrderStatus, deleteOrder } = require("../controllers/orderController");
const router= express.Router();
const { isAuthenticatedError,authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedError,newOrder);

router.route("/order/:id").get(isAuthenticatedError, SingleOrder)

router.route("/orders/me").get(isAuthenticatedError, myOrders);

router.route("/admin/orders").get(isAuthenticatedError, authorizeRoles("admin"), getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedError, authorizeRoles("admin"), UpdateOrderStatus).delete(isAuthenticatedError, authorizeRoles("admin"), deleteOrder)

module.exports= router;