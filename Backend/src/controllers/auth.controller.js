const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password required");
    }

    const user = await authService.registerUser(email, password);

    return successResponse(res, "Register Success", user, 201);
  } catch (error) {
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password required", 400);
    }

    const user = await authService.loginUser(email, password);

    return successResponse(res, "Login Success", user, 200);
  } catch (error) {
    return errorResponse(res, error.message || "Internal server error", 401);
  }
}

module.exports = { register, login };
