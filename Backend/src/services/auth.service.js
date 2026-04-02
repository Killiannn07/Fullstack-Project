const userService = require("./user.service");
const emailService = require("./email.service");
const crypto = require("crypto");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");

async function registerUser(email, password) {
  const existingUser = await userService.getUsersByEmail(email);

  if (existingUser) {
    throw new Error("Email already existing");
  }

  const hashedPassword = await hashPassword(password);

  return userService.createUser(email, hashedPassword);
}

async function loginUser(email, password) {
  const user = await userService.getUsersByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

async function forgotPassword(email) {
  const user = await userService.getUsersByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(16).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

  await userService.updateResetToken(email, resetToken, resetTokenExpiry);

  const frontendUrl =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_DEV;

  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  await emailService.sendResetPasswordEmail(email, resetLink);

  return { message: "Password reset email sent" };
}

async function resetPassword(resetToken, newPassword) {
  const user = await userService.getUserByResetToken(resetToken);

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await hashPassword(newPassword);

  const updatedUser = await userService.updatePassword(user.id, hashedPassword);

  return { message: "Password has been reset successfully", user: updatedUser };
}

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
