const { successResponse, errorResponse } = require("../utils/response");
const orderService = require("../services/order.service");

async function getOrders(req, res) {
  try {
    userId = req.user.id
    const orders = await orderService.getOrdersByUser(userId);

    return successResponse(res, "Orders Fetched", orders);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

async function getOrderDetail(req, res) {
  try {
    const userId = req.user.id
    const {orderId} = req.params
    const orders = await orderService.getOrderDetail(orderId, userId);

    return successResponse(res, "Orders Detail Fetched", orders);
  } catch (error) {
    return errorResponse(res, error.message, 500)
  }
}

async function updateStatus(req, res) {
  const { orderId } = req.params;
  const { status } = req.body;

  const result = await orderService.updateOrderStatus(orderId, status);

  return successResponse(res, result.message);
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
    const result = await orderService.checkout(userId);

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
