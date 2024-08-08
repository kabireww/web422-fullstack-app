import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
