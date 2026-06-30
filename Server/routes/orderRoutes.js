const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updateOrderToPaid,
  getAdminStats,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Secure all order routes

router.route("/")
  .post(createOrder)
  .get(admin, getOrders);

router.route("/myorders")
  .get(getMyOrders);

router.route("/stats")
  .get(admin, getAdminStats);

router.route("/:id")
  .get(getOrderById);

router.route("/:id/pay")
  .put(updateOrderToPaid);

router.route("/:id/status")
  .put(admin, updateOrderStatus);

module.exports = router;