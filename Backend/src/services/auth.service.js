const userService = require("./user.service");
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

  return {token, user: {id: user.id, email: user.email, role: user.role}}
}

module.exports = { registerUser, loginUser };
