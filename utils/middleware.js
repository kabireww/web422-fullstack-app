import { verifyToken } from './auth';

export const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decodedToken = verifyToken(token);
      req.user = decodedToken;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
