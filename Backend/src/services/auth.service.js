const userService = require("./user.service");
const { hashPassword, comparePassword } = require("../utils/password");
const { successResponse, errorResponse } = require("../utils/response");
const { generateToken } = require("../utils/token");

async function registerUser(email, password) {
  const existingUser = await userService.getUsersByEmail(email);

  if (existingUser) {
    return errorResponse(res, "Email already existing", 400);
  }

  const hashedPassword = await hashPassword(password);

  return userService.createUser(email, hashedPassword);
}

async function loginUser(email, password) {
  const user = await userService.getUsersByEmail(email);
  if (!user) {
    return errorResponse(res, "Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return errorResponse(res, "Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return token;
}

module.exports = { registerUser, loginUser };
