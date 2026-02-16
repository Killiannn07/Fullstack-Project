const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { addToCart, getCart, updateCart, deleteCart } = require("../controllers/cart.controller");

router.post("/", authMiddleware, addToCart);
router.get("/",authMiddleware, getCart)
router.put("/:id",authMiddleware, updateCart)
router.delete("/:id",authMiddleware, deleteCart)
module.exports = router;
