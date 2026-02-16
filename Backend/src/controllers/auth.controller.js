const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if ((!email, !password)) {
      return errorResponse(res, "Email and password required");
    }

    const user = await authService.registerUser(email, password);

    return successResponse(res, "Register Success", user, 201);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if ((!email, !password)) {
      return errorResponse(res, "Email and password required");
    }

    const user = await authService.loginUser(email, password);

    return successResponse(res, "Login Success", user, 201);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
}

module.exports = { register, login };
