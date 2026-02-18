const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { getOrders, getOrderDetail,updateStatus, getAllOrders, checkout } = require("../controllers/order.controller");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/:id", authMiddleware, getOrders);
router.post("/:id", authMiddleware, checkout);
router.get("/orderdetail/:orderId", authMiddleware, getOrderDetail);
router.patch("/:orderId/status", authMiddleware,roleMiddleware("admin"), updateStatus);
router.get("/admin/all", authMiddleware,roleMiddleware("admin"), getAllOrders);


module.exports = router;
