const express = require("express");
const router = express.Router();
const {
  getProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const validate = require("../middlewares/validate");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/product.validation");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/", getProduct);
router.get("/:id", getProductById);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(updateProductSchema),
  updateProduct,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(updateProductSchema),
  deleteProduct,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["user", "admin"]),
  validate(createProductSchema),
  createProduct,
);

module.exports = router;
