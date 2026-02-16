const { verifyToken } = require("../utils/token");
const { successResponse, errorResponse } = require("../utils/response");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, "Invalid token format", 401);
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
}

module.exports = authMiddleware;
