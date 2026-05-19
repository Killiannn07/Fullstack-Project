const { successResponse, errorResponse } = require("../utils/response");
const orderService = require("../services/order.service");

async function getOrders(req, res) {
  try {
    userId = req.user.id;
    const orders = await orderService.getOrdersByUser(userId);

    return successResponse(res, "Orders Fetched", orders);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

async function getOrderDetail(req, res) {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    console.log("orderId:", orderId, "userId:", userId);
    const orders = await orderService.getOrderDetail(orderId, userId);
    console.log("orders:", orders);
    return successResponse(res, "Orders Detail Fetched", orders);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

async function updateStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const result = await orderService.updateOrderStatus(orderId, status);

    return successResponse(res, result.message);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to update order status", 400);
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await orderService.getAllOrders();

    return successResponse(res, "Orders Fetched", orders);
  } catch (error) {
    return errorResponse(res, "Failed to fetched orders", 500);
  }
}

async function checkout(req, res) {
  try {
    const userId = req.user.id;

    const { cartItemIds } = req.body;

    

    if (!cartItemIds || cartItemIds.length === 0) {
      return errorResponse(res, "Pilih item terlebih dahulu", 400);
    }
    const result = await orderService.checkout(userId, cartItemIds);
    return successResponse(res, "Checkout done", result);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

module.exports = {
  getOrders,
  getOrderDetail,
  updateStatus,
  getAllOrders,
  checkout,
};
