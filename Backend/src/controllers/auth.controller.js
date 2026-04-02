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

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email required", 400);
    }

    const result = await authService.forgotPassword(email);

    return successResponse(res, result.message, result, 200);
  } catch (error) {
    return errorResponse(res, error.message || "Internal server error", 400);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token } = req.query;
    const { newPassword, confirmPassword } = req.body;

    if (!token) {
      return errorResponse(res, "Reset token required", 400);
    }

    if (!newPassword || !confirmPassword) {
      return errorResponse(res, "Password and confirm password required", 400);
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, "Password tidak cocok", 400);
    }

    // Validasi password minimal 6 karakter dan harus ada huruf dan angka
    if (newPassword.length < 6) {
      return errorResponse(res, "Password minimal 6 karakter", 400);
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasLetter || !hasNumber) {
      return errorResponse(res, "Password harus berisi huruf dan angka", 400);
    }

    const result = await authService.resetPassword(token, newPassword);

    return successResponse(res, result.message, result, 200);
  } catch (error) {
    return errorResponse(res, error.message || "Internal server error", 400);
  }
}

module.exports = { register, login, forgotPassword, resetPassword };
