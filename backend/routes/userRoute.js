const express= require("express");
const { registerUser, loginUser,logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleuser, updateUserRole, deleteUser } = require("../controllers/userController");
const router= express.Router();
const {authorizeRoles, isAuthenticatedError}=require("../middleware/auth")
router.route("/register").post(registerUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedError, updatePassword);

router.route("/login").post(loginUser);

router.route("/me").get(isAuthenticatedError,getUserDetails);
router.route("/me/update").put(isAuthenticatedError,updateProfile);

router.route("/logout").get(logout);
router.route("/admin/users").get(isAuthenticatedError, authorizeRoles("admin"),getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedError, authorizeRoles("admin"),getSingleuser).put(isAuthenticatedError,authorizeRoles("admin"),updateUserRole).delete(isAuthenticatedError, authorizeRoles("admin"),deleteUser);
module.exports= router;