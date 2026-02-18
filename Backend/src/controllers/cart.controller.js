const cartService = require("../services/cart.service");
const { successResponse, errorResponse } = require("../utils/response");

async function addToCart(req, res) {
  try {
    const { product_id, quantity } = req.body;

    const cart = await cartService.addToCart(req.user.id, product_id, quantity);

    return successResponse(res, "Product added to cart", cart);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
}

async function getCart(req, res) {
  try {
    const cart = await cartService.getCartByUser(req.user.id);
    return successResponse(res, "Cart fetched", cart);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
}

async function updateCart(req, res) {
  try {
    const cartId = Number(req.params.id);
    const { quantity } = req.body;
    const cart = await cartService.updateCart(req.user.id, cartId, quantity);
    return successResponse(res, "Cart updated", cart);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
}

async function deleteCart(req, res) {
  try {
    const cartId = Number(req.params.id);

    await cartService.deleteCart(req.user.id, cartId);

    return successResponse(res, "Cart deleted");
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
}

module.exports = { addToCart, getCart, updateCart, deleteCart };
